import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createSign, generateKeyPairSync } from "node:crypto";

import {
  PM_RUNNERS,
  SuperApp,
  buildBootFiles,
  computeFileSha256,
  generateScaffoldPlan,
  getCiTemplates,
  installHints,
  loadExternalPresets,
  phase7ApiBlueprint,
  phase7DeveloperBrief,
  phase7RiskRegister,
  phase7CompletionReport,
  phase7ExecutionPlan,
  phase7NextActions,
  phase7StatusReport,
  queryStarterPresets,
  scaffoldFromPreset,
  scaffoldStarterApp,
  scorePreset,
  securityPolicyReport,
  verifyPresetFileIntegrity,
  verifyPresetSignatureFile
} from "../src/super-app.js";
import { main } from "../bin/super-app.js";

test("goal model basic flow", () => {
  const app = new SuperApp();
  app.addGoal("Growth", 2);
  app.addTask("Growth", "Launch campaign");
  app.completeTask("Growth", "Launch campaign");
  assert.equal(app.listGoals()[0].tasks[0].done, true);
});

test("save and load", () => {
  const app = new SuperApp();
  app.addGoal("Roadmap", 1);
  app.addTask("Roadmap", "Define milestones");
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-")), "state.json");
  app.save(file);
  const loaded = SuperApp.load(file);
  assert.equal(loaded.goals[0].name, "Roadmap");
});

test("security and validation checks", () => {
  assert.throws(() => generateScaffoldPlan("../evil", "react", ["tailwind"], "npm"), /Invalid project name/);
  assert.throws(() => generateScaffoldPlan("bad", "next", ["tailwind"], "deno"), /Incompatible package manager/);
  const report = securityPolicyReport("react", ["tailwind"], "npm", true);
  assert.equal(report.checks.find((c) => c.id === "run_mode").status, "warn");
});

test("starter result includes generated files", () => {
  const result = scaffoldStarterApp("starter", "vue", ["antd"], "pnpm", false, "calm_pro", ["node_basic"], { withDocsSite: true });
  assert.ok(result.security.score > 0);
  assert.equal(result.ciTemplates[0].id, "node_basic");
  assert.ok(result.generatedFiles.find((f) => f.filename === "docs/index.md"));
});

test("preset query filters", () => {
  assert.ok(queryStarterPresets({ ecosystem: "node" }).length >= 5);
  assert.ok(queryStarterPresets({ ecosystem: "deno" }).find((p) => p.id === "deno_api_edge"));
  const ai = queryStarterPresets({ category: "ai" });
  assert.equal(ai[0].id, "ai_playground");
  assert.ok(ai[0].score > 0);
  assert.ok(scorePreset(ai[0]) > 0);
});

test("external preset integrity and loading", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-preset-"));
  const file = path.join(dir, "presets.json");
  fs.writeFileSync(file, JSON.stringify({ starter_lab: { category: "research", maturity: "experimental", description: "Research", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "x" } }, null, 2));
  const hash = computeFileSha256(file);
  assert.equal(verifyPresetFileIntegrity(file, hash).verified, true);
  assert.throws(() => verifyPresetFileIntegrity(file, "deadbeef"), /integrity check failed/);
  const loaded = loadExternalPresets(file, hash);
  assert.ok(loaded.starter_lab);
  const out = scaffoldFromPreset("lab-app", "starter_lab", false, {}, { externalPresets: loaded, withDocsSite: true });
  assert.equal(out.framework, "astro");
  assert.ok(out.generatedFiles.find((f) => f.filename === "docs/index.md"));
});



test("external preset signature verification", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-sign-"));
  const file = path.join(dir, "presets.json");
  const sig = path.join(dir, "presets.sig");
  const pub = path.join(dir, "pub.pem");

  fs.writeFileSync(file, JSON.stringify({ starter_lab: { category: "research", maturity: "experimental", description: "Research", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "x" } }));

  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  fs.writeFileSync(pub, publicKey.export({ type: "spki", format: "pem" }));

  const signer = createSign("sha256");
  signer.update(fs.readFileSync(file));
  signer.end();
  fs.writeFileSync(sig, signer.sign(privateKey));

  assert.equal(verifyPresetSignatureFile(file, sig, pub).verified, true);
  const hash = computeFileSha256(file);
  const loaded = loadExternalPresets(file, hash, sig, pub);
  assert.ok(loaded.starter_lab);
});


test("sha256-file signature provider", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-sha-sig-"));
  const file = path.join(dir, "presets.json");
  const sig = path.join(dir, "presets.sha256");
  fs.writeFileSync(file, JSON.stringify({ starter_lab: { category: "research", maturity: "experimental", description: "Research", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "x" } }));
  fs.writeFileSync(sig, computeFileSha256(file));
  assert.equal(verifyPresetSignatureFile(file, sig, "", "sha256-file").verified, true);
  const loaded = loadExternalPresets(file, computeFileSha256(file), sig, "", "sha256-file");
  assert.ok(loaded.starter_lab);
});


test("minisign and cosign providers invoke external verifier", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-extsig-"));
  const file = path.join(dir, "presets.json");
  const sig = path.join(dir, "presets.sig");
  const pub = path.join(dir, "public.key");
  fs.writeFileSync(file, JSON.stringify({ starter_lab: { category: "research", maturity: "experimental", description: "Research", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "x" } }));
  fs.writeFileSync(sig, "sig");
  fs.writeFileSync(pub, "pub");

  const calls = [];
  const commandRunner = (cmd, args) => {
    calls.push({ cmd, args });
    return { status: 0, stdout: "ok", stderr: "" };
  };

  const mini = verifyPresetSignatureFile(file, sig, pub, "minisign", { commandRunner });
  assert.equal(mini.verified, true);

  const cosign = verifyPresetSignatureFile(file, sig, pub, "cosign-blob", { commandRunner });
  assert.equal(cosign.verified, true);

  assert.equal(calls[0].cmd, "minisign");
  assert.deepEqual(calls[0].args, ["-V", "-m", file, "-x", sig, "-p", pub]);
  assert.equal(calls[1].cmd, "cosign");
  assert.deepEqual(calls[1].args, ["verify-blob", "--key", pub, "--signature", sig, file]);
});

test("external signature provider reports missing binary clearly", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-extsig-missing-"));
  const file = path.join(dir, "presets.json");
  const sig = path.join(dir, "presets.sig");
  const pub = path.join(dir, "public.key");
  fs.writeFileSync(file, JSON.stringify({ starter_lab: { framework: "astro", packageManager: "pnpm", ui: ["tailwind"] } }));
  fs.writeFileSync(sig, "sig");
  fs.writeFileSync(pub, "pub");

  assert.throws(
    () => verifyPresetSignatureFile(file, sig, pub, "minisign", { commandRunner: () => ({ error: { code: "ENOENT", message: "not found" }, status: 1, stderr: "" }) }),
    /minisign is not installed/
  );
});

test("boot files and package metadata", () => {
  assert.equal(buildBootFiles("x", false).length, 2);
  assert.equal(buildBootFiles("x", true).length, 4);
  assert.equal(getCiTemplates(["node_basic", "node_security"]).length, 2);
  const hints = installHints();
  ["npm", "pnpm", "yarn", "bun", "deno"].forEach((manager) => assert.ok(hints[manager]));
  assert.deepEqual(new Set(Object.keys(PM_RUNNERS)), new Set(["npm", "pnpm", "yarn", "bun", "deno"]));
});



test("phase 7 execution plan exposes collaborative and agentic tracks", () => {
  const plan = phase7ExecutionPlan();
  assert.equal(plan.phase, 7);
  assert.equal(plan.status, "in_progress");
  assert.ok(plan.tracks.find((t) => t.id === "agentic_contribution"));
  assert.ok(plan.tracks.find((t) => t.id === "web_ui_foundation"));
});

test("phase 7 status report calculates completion", () => {
  const report = phase7StatusReport();
  assert.equal(report.phase, 7);
  assert.equal(report.totalMilestones > 0, true);
  assert.equal(report.doneMilestones > 0, true);
  assert.equal(report.completion > 0, true);
  assert.ok(report.tracks.every((t) => typeof t.completion === "number"));
});

test("phase 7 next actions returns pending milestones", () => {
  const next = phase7NextActions(2);
  assert.equal(next.phase, 7);
  assert.equal(next.actions.length, 0);
  assert.ok(next.actions.every((a) => a.trackId && a.milestoneId));
});

test("phase 7 api blueprint exposes secure core endpoints", () => {
  const api = phase7ApiBlueprint();
  assert.equal(api.phase, 7);
  assert.equal(api.endpoints.length >= 6, true);
  assert.ok(api.endpoints.find((e) => e.path === "/api/v1/goals"));
  assert.ok(api.securityChecks.includes("Write audit events for goal/preset mutations"));
});

test("phase 7 developer brief returns markdown board", () => {
  const brief = phase7DeveloperBrief();
  assert.equal(brief.phase, 7);
  assert.equal(typeof brief.markdown, "string");
  assert.ok(brief.markdown.includes("Progress Board"));
  assert.ok(brief.markdown.includes("Next Prioritized Actions"));
});

test("phase 7 risk register lists high-priority mitigations", () => {
  const register = phase7RiskRegister();
  assert.equal(register.phase, 7);
  assert.equal(register.risks.length >= 4, true);
  assert.ok(register.risks.find((r) => r.id === "sync_conflict_data_loss"));
});

test("phase 7 completion report reaches done", () => {
  const report = phase7CompletionReport();
  assert.equal(report.phase, 7);
  assert.equal(report.status, "done");
  assert.equal(report.completion, 100);
});

test("cli commands return success", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-cli-"));
  const file = path.join(dir, "presets.json");
  fs.writeFileSync(file, JSON.stringify({ starter_lab: { category: "research", maturity: "experimental", description: "Research", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "x" } }));
  const hash = computeFileSha256(file);

  assert.equal(main(["install-hints", "--json"]), 0);
  assert.equal(main(["preset", "--list", "--category", "ai", "--min-score", "0.6", "--json"]), 0);
  assert.equal(main(["init", "my-saas", "--preset", "saas", "--with-docs-site"]), 0);
  assert.equal(main(["phase7-plan", "--json"]), 0);
  assert.equal(main(["phase7-status", "--json"]), 0);
  assert.equal(main(["phase7-next", "--limit", "2", "--json"]), 0);
  assert.equal(main(["phase7-api", "--json"]), 0);
  assert.equal(main(["phase7-brief", "--json"]), 0);
  assert.equal(main(["phase7-risks", "--json"]), 0);
  assert.equal(main(["phase7-complete", "--json"]), 0);

  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const sig = path.join(dir, "presets.sig");
  const pub = path.join(dir, "pub.pem");
  fs.writeFileSync(pub, publicKey.export({ type: "spki", format: "pem" }));
  const signer = createSign("sha256");
  signer.update(fs.readFileSync(file));
  signer.end();
  fs.writeFileSync(sig, signer.sign(privateKey));

  assert.equal(main(["preset", "--list", "--preset-file", file, "--preset-sha256", hash, "--preset-signature", sig, "--preset-public-key", pub, "--preset-signature-provider", "rsa-pem", "--category", "research", "--json"]), 0);
});
