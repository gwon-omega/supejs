import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

import {
  PM_RUNNERS,
  SuperApp,
  detectDeveloperEnvironment,
  evaluatePolicy,
  generateBootFiles,
  generateScaffoldPlan,
  getCiTemplates,
  installHints,
  listStarterPresets,
  loadExternalPresets,
  loadPolicyFile,
  queryStarterPresets,
  rankStarterPresets,
  reminderPlan,
  renderScaffoldScript,
  scaffoldFromPreset,
  scaffoldStarterApp,
  securityPolicyReport,
  syncPlan,
  userWorkspace
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
  assert.throws(() => generateScaffoldPlan("con", "react", ["tailwind"], "npm"), /reserved on Windows/);
  assert.throws(() => generateScaffoldPlan("bad", "next", ["tailwind"], "deno"), /Incompatible package manager/);
  assert.ok(generateScaffoldPlan("edge-kit", "deno_fresh", ["tailwind"], "deno")[0].startsWith("deno run -A -r jsr:@fresh/create"));
  const report = securityPolicyReport("react", ["tailwind"], "npm", true);
  assert.equal(report.checks.find((c) => c.id === "run_mode").status, "warn");
});

test("starter result includes security, ci templates, and scripts", () => {
  const result = scaffoldStarterApp("starter", "vue", ["antd"], "pnpm", false, "calm_pro", ["node_basic"], { includeDocsSite: true });
  assert.ok(result.security.score > 0);
  assert.equal(result.ciTemplates[0].id, "node_basic");
  assert.ok(result.scripts.bash.includes("set -euo pipefail"));
  assert.ok(result.bootFiles.find((f) => f.path === "docs/index.md"));
});

test("rendered scripts support cmd and powershell", () => {
  const commands = ["npx create-vite app --template react-ts", "cd app", "npm install", "# Theme preset: calm_pro"];
  assert.ok(renderScaffoldScript(commands, "cmd").includes("cd /d app"));
  assert.ok(renderScaffoldScript(["cd my app"], "cmd").includes("cd /d \"my app\""));
  assert.ok(renderScaffoldScript(commands, "powershell").includes("Set-Location 'app'"));
});


test("boot file generation optional docs-site", () => {
  const basic = generateBootFiles("sample", "react", false);
  const withDocs = generateBootFiles("sample", "react", true);
  assert.ok(basic.find((f) => f.path === "README.generated.md"));
  assert.equal(withDocs.some((f) => f.path === "docs/index.md"), true);
});

test("preset list and scaffold", () => {
  const presets = listStarterPresets();
  assert.ok(presets.length >= 8);
  assert.ok(presets.find((p) => p.id === "saas"));
  const out = scaffoldFromPreset("my-saas", "saas", false, {}, [], { includeDocsSite: true });
  assert.equal(out.framework, "next");
  assert.ok(out.bootFiles.find((f) => f.path === "docs/index.md"));
});


test("external presets can be loaded and queried", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-presets-")), "presets.json");
  fs.writeFileSync(file, JSON.stringify({
    enterprise_portal: {
      category: "internal-tools",
      maturity: "stable",
      description: "Enterprise portal preset",
      framework: "react",
      packageManager: "npm",
      ui: ["tailwind"],
      theme: "calm_pro",
      ciTemplates: ["node_basic"],
      researchNotes: "Custom organizational baseline"
    }
  }), "utf-8");
  const expectedSha = crypto.createHash("sha256").update(fs.readFileSync(file, "utf-8")).digest("hex");
  const external = loadExternalPresets(file, { expectedSha256: expectedSha });
  assert.equal(external[0].id, "enterprise_portal");
  const queried = queryStarterPresets({ category: "internal-tools", externalPresets: external });
  assert.ok(queried.find((item) => item.id === "enterprise_portal"));
  const out = scaffoldFromPreset("acme-portal", "enterprise_portal", false, {}, external);
  assert.equal(out.framework, "react");
});



test("external preset integrity check rejects wrong hash", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-integrity-presets-")), "presets.json");
  fs.writeFileSync(file, JSON.stringify({
    ext_secure: {
      category: "product",
      maturity: "stable",
      description: "Secure external preset",
      framework: "react",
      packageManager: "npm",
      ui: ["tailwind"],
      theme: "calm_pro",
      ciTemplates: ["node_basic"],
      researchNotes: "signed"
    }
  }), "utf-8");
  assert.throws(() => loadExternalPresets(file, { expectedSha256: "deadbeef" }), /integrity check failed/);
});

test("external preset validation rejects unknown references", () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-bad-presets-")), "bad-presets.json");
  fs.writeFileSync(file, JSON.stringify({
    badone: {
      category: "internal-tools",
      maturity: "stable",
      description: "Bad preset",
      framework: "unknown_framework",
      packageManager: "npm",
      ui: ["tailwind"],
      theme: "calm_pro",
      ciTemplates: ["node_basic"],
      researchNotes: "Invalid framework reference"
    }
  }), "utf-8");
  assert.throws(() => loadExternalPresets(file), /unknown framework/);
});

test("preset query filters", () => {
  const nodePresets = queryStarterPresets({ ecosystem: "node" });
  const denoPresets = queryStarterPresets({ ecosystem: "deno" });
  const aiPresets = queryStarterPresets({ category: "ai" });
  const searched = queryStarterPresets({ search: "edge" });
  assert.ok(nodePresets.length >= 5);
  assert.ok(denoPresets.find((p) => p.id === "deno_api_edge"));
  assert.equal(aiPresets[0].id, "ai_playground");
  assert.ok(searched.length >= 1);
});




test("user workspace validates and resolves profile paths", () => {
  const ws = userWorkspace("dev_team");
  assert.ok(ws.stateFile.endsWith("state.json"));
  assert.ok(ws.presetsDir.endsWith("presets"));
  assert.throws(() => userWorkspace("../bad"), /Invalid user id/);
});


test("sync plan creates provider-specific git workflow", () => {
  const plan = syncPlan("dev_team", "gitlab", "backup");
  assert.equal(plan.provider, "gitlab");
  assert.ok(plan.steps.find((s) => s.includes("git remote add backup")));
  assert.ok(plan.workspace.root.includes("dev_team"));
});

test("reminder plan provides platform scheduler guidance", () => {
  assert.equal(reminderPlan("linux").scheduler, "cron");
  assert.equal(reminderPlan("darwin").scheduler, "launchd");
  assert.equal(reminderPlan("win32").scheduler, "task-scheduler");
});

test("preset ranking returns score-sorted results", () => {
  const ranked = rankStarterPresets(queryStarterPresets());
  assert.ok(ranked.length >= 8);
  assert.ok(ranked[0].score >= ranked[1].score);
  assert.equal(typeof ranked[0].score, "number");

  const telemetryRanked = rankStarterPresets([
    { id: "a", category: "product", maturity: "stable", ciTemplates: ["node_basic"], ui: ["tailwind"], maintenanceScore: 10, adoptionScore: 10 },
    { id: "b", category: "product", maturity: "stable", ciTemplates: ["node_basic"], ui: ["tailwind"], maintenanceScore: 95, adoptionScore: 90 }
  ], { telemetrySignals: true });
  assert.equal(telemetryRanked[0].id, "b");
});

test("ci templates fetch", () => {
  const templates = getCiTemplates(["node_basic", "node_security"]);
  assert.equal(templates.length, 2);
});

test("install hints and package managers", () => {
  const hints = installHints();
  ["npm", "pnpm", "yarn", "bun", "deno"].forEach((manager) => assert.ok(hints[manager]));
  assert.deepEqual(new Set(Object.keys(PM_RUNNERS)), new Set(["npm", "pnpm", "yarn", "bun", "deno"]));
});

test("doctor report contains core environment metadata", () => {
  const report = detectDeveloperEnvironment();
  const refreshed = detectDeveloperEnvironment(true);
  const cached = detectDeveloperEnvironment();
  assert.ok(["bash", "powershell"].includes(report.recommendedShell));
  assert.equal(typeof report.packageManagers.npm, "boolean");
  assert.deepEqual(cached, refreshed);
});



test("policy evaluation enforces framework, ui, and package manager rules", () => {
  const policy = {
    version: "2025.1",
    blockedFrameworks: ["next"],
    blockedUi: ["primer"],
    allowedPackageManagers: ["pnpm", "yarn"]
  };

  const passing = evaluatePolicy({ framework: "react", packageManager: "pnpm", uiComponents: ["tailwind"] }, policy);
  assert.equal(passing.status, "pass");

  const failing = evaluatePolicy({ framework: "next", packageManager: "npm", uiComponents: ["primer"] }, policy);
  assert.equal(failing.status, "fail");
  assert.equal(failing.checks.find((c) => c.id === "framework_policy").status, "fail");
  assert.equal(failing.checks.find((c) => c.id === "ui_policy").status, "fail");
  assert.equal(failing.checks.find((c) => c.id === "package_manager_policy").status, "fail");
});


test("policy evaluation normalizes casing and ignores invalid policy entries", () => {
  const policy = {
    blockedFrameworks: [" NEXT ", 42, null],
    blockedUi: [" PRIMER ", {}, ""],
    allowedPackageManagers: "pnpm"
  };

  const result = evaluatePolicy({ framework: "Next", packageManager: "NPM", uiComponents: ["Primer", "tailwind"] }, policy);
  assert.equal(result.status, "fail");
  assert.equal(result.checks.find((c) => c.id === "framework_policy").status, "fail");
  assert.equal(result.checks.find((c) => c.id === "ui_policy").status, "fail");
  assert.equal(result.checks.find((c) => c.id === "package_manager_policy").status, "pass");
});


test("policy file loader validates JSON object payload", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "super-app-policy-"));
  const good = path.join(dir, "policy.json");
  const bad = path.join(dir, "bad-policy.json");
  fs.writeFileSync(good, JSON.stringify({ version: "1", blockedFrameworks: ["nuxt"] }), "utf-8");
  fs.writeFileSync(bad, "[]", "utf-8");

  assert.equal(loadPolicyFile(good).blockedFrameworks[0], "nuxt");
  assert.throws(() => loadPolicyFile(bad), /Invalid policy file format/);
});



test("supe-js binary alias prints help", () => {
  const result = spawnSync(process.execPath, ["bin/supe-js.js", "--help"], { encoding: "utf-8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Supe Js/);
});

test("cli commands return success", () => {
  assert.equal(main(["install-hints", "--json"]), 0);
  assert.equal(main(["doctor", "--json"]), 0);
  assert.equal(main(["reminder", "--platform", "linux", "--json"]), 0);
  assert.equal(main(["profile", "--user", "dev_team", "--json"]), 0);
  assert.equal(main(["sync", "--user", "dev_team", "--provider", "gitlab", "--json"]), 0);

  const policyFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-cli-policy-")), "policy.json");
  fs.writeFileSync(policyFile, JSON.stringify({ blockedFrameworks: ["next"], allowedPackageManagers: ["pnpm"] }), "utf-8");
  assert.equal(main(["policy-check", "--file", policyFile, "--framework", "react", "--package-manager", "pnpm", "--ui", "tailwind", "--json"]), 0);
  assert.equal(main(["policy-check", "--file", policyFile, "--framework", "next", "--package-manager", "npm", "--ui", "tailwind", "--json"]), 2);
  assert.equal(main(["doctor", "--refresh", "--json"]), 0);
  assert.equal(main(["security", "--framework", "react", "--package-manager", "npm", "--ui", "tailwind", "--json"]), 0);
  assert.equal(main(["preset", "--list", "--json"]), 0);
  assert.equal(main(["preset", "--list", "--category", "ai", "--json"]), 0);
  assert.equal(main(["preset", "--list", "--rank", "--json"]), 0);
  assert.equal(main(["preset", "--list", "--rank", "--telemetry-score", "--json"]), 0);
  assert.equal(main(["preset", "--name", "saas", "my-saas", "--shell", "cmd", "--with-docs-site"]), 0);

  const extFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "super-app-cli-presets-")), "presets.json");
  fs.writeFileSync(extFile, JSON.stringify({
    external: {
      category: "product",
      maturity: "experimental",
      description: "External preset",
      framework: "vue",
      packageManager: "npm",
      ui: ["tailwind"],
      theme: "sunrise_flow",
      ciTemplates: ["node_basic"],
      researchNotes: "External file"
    }
  }), "utf-8");
  const extHash = crypto.createHash("sha256").update(fs.readFileSync(extFile, "utf-8")).digest("hex");
  assert.equal(main(["preset", "--name", "external", "ext-app", "--from", extFile, "--from-sha256", extHash, "--json"]), 0);
});
