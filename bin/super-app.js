#!/usr/bin/env node
import {
  FRAMEWORKS,
  PM_RUNNERS,
  UI_LIBS,
  demo,
  designGuidance,
  detectDeveloperEnvironment,
  evaluatePolicy,
  installHints,
  loadExternalPresets,
  loadPolicyFile,
  reminderPlan,
  queryStarterPresets,
  rankStarterPresets,
  researchCatalog,
  scaffoldFromPreset,
  scaffoldStarterApp,
  securityPolicyReport,
  syncPlan,
  userWorkspace
} from "../src/super-app.js";

function printHelp() {
  console.log(`Supe Js (formerly Super App): Node.js goals + starter app scaffolding

Usage:
  super-app demo
  super-app doctor [--refresh] [--json]
  super-app install-hints [--json]
  super-app reminder [--platform <linux|macos|windows>] [--json]
  super-app profile --user <id> [--base-dir <path>] [--json]
  super-app sync --user <id> [--provider <github|gitlab|bitbucket>] [--remote <name>] [--json]
  super-app policy-check --file <policy.json> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--json]
  super-app design [--theme <neon_noir|calm_pro|sunrise_flow>] [--json]
  super-app catalog [--json]
  super-app preset --list [--category <name>] [--ecosystem <node|deno>] [--search <term>] [--from <file>] [--from-sha256 <hex>] [--rank] [--telemetry-score] [--json]
  super-app preset --name <saas|dashboard|commerce|docs_portal|design_system|ai_playground|realtime_hub|deno_api_edge|external> <project-name> [--run] [--from <file>] [--from-sha256 <hex>] [--with-docs-site] [--shell <bash|powershell|cmd>] [--json]
  super-app security [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--run-intent] [--json]
  super-app starter <name> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--theme <preset>] [--run] [--with-docs-site] [--shell <bash|powershell|cmd>] [--json]

Frameworks: ${Object.keys(FRAMEWORKS).join(", ")}
UI libs: ${Object.keys(UI_LIBS).join(", ")}
Package managers: ${Object.keys(PM_RUNNERS).join(", ")}
`);
}

function argValue(args, key, fallback) {
  const index = args.indexOf(key);
  if (index === -1 || index + 1 >= args.length) return fallback;
  return args[index + 1];
}

function parseUiArgs(args) {
  const uiIndex = args.indexOf("--ui");
  let ui = ["tailwind"];
  if (uiIndex !== -1) {
    ui = [];
    for (let i = uiIndex + 1; i < args.length && !args[i].startsWith("--"); i += 1) ui.push(args[i]);
    if (ui.length === 0) ui = ["tailwind"];
  }
  return ui;
}

function findPresetProjectArg(argv) {
  for (let i = 1; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      if (["--name", "--category", "--ecosystem", "--search", "--shell", "--from", "--from-sha256", "--with-docs-site", "--rank", "--telemetry-score"].includes(argv[i])) i += 1;
      continue;
    }
    return argv[i];
  }
  return "";
}

function formatResult(result, shell, outputJson) {
  if (outputJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (shell && result.scripts?.[shell]) {
    console.log(result.scripts[shell]);
    return;
  }
  console.log(JSON.stringify(result, null, 2));
}

function main(argv = process.argv.slice(2)) {
  const command = argv[0] || "demo";
  if (command === "--help" || command === "-h") return printHelp(), 0;
  if (command === "demo") return demo(), 0;

  if (command === "doctor") {
    const report = detectDeveloperEnvironment(argv.includes("--refresh"));
    if (argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Platform: ${report.platform} (${report.arch})`);
      console.log(`Node: ${report.nodeVersion}`);
      console.log(`Shell: ${report.shell}`);
      console.log(`Recommended script shell: ${report.recommendedShell}`);
      Object.entries(report.packageManagers).forEach(([manager, installed]) => console.log(`- ${manager}: ${installed ? "available" : "missing"}`));
    }
    return 0;
  }


  if (command === "reminder") {
    const plan = reminderPlan(argValue(argv, "--platform", process.platform));
    if (argv.includes("--json")) console.log(JSON.stringify(plan, null, 2));
    else {
      console.log(`Scheduler: ${plan.scheduler}`);
      console.log(`Sample: ${plan.sampleCommand}`);
      console.log(plan.message);
    }
    return 0;
  }


  if (command === "profile") {
    const user = argValue(argv, "--user", "");
    if (!user) throw new Error("Usage: super-app profile --user <id> [--base-dir <path>] [--json]");
    const workspace = userWorkspace(user, argValue(argv, "--base-dir", undefined));
    if (argv.includes("--json")) console.log(JSON.stringify(workspace, null, 2));
    else {
      console.log(`User: ${workspace.userId}`);
      console.log(`Root: ${workspace.root}`);
      console.log(`State file: ${workspace.stateFile}`);
      console.log(`Presets dir: ${workspace.presetsDir}`);
    }
    return 0;
  }


  if (command === "sync") {
    const user = argValue(argv, "--user", "");
    if (!user) throw new Error("Usage: super-app sync --user <id> [--provider <github|gitlab|bitbucket>] [--remote <name>] [--json]");
    const plan = syncPlan(user, argValue(argv, "--provider", "github"), argValue(argv, "--remote", "origin"));
    if (argv.includes("--json")) console.log(JSON.stringify(plan, null, 2));
    else {
      console.log(`Provider: ${plan.provider}`);
      plan.steps.forEach((step) => console.log(`- ${step}`));
      console.log(`Notes: ${plan.notes}`);
    }
    return 0;
  }


  if (command === "policy-check") {
    const policyFile = argValue(argv, "--file", "");
    if (!policyFile) throw new Error("Usage: super-app policy-check --file <policy.json> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--json]");
    const policy = loadPolicyFile(policyFile);
    const config = {
      framework: argValue(argv, "--framework", "react"),
      packageManager: argValue(argv, "--package-manager", "npm"),
      uiComponents: parseUiArgs(argv)
    };
    const result = evaluatePolicy(config, policy);
    if (argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`Policy status: ${result.status}`);
      result.checks.forEach((check) => console.log(`- ${check.id}: ${check.status} (${check.detail})`));
    }
    return result.status === "pass" ? 0 : 2;
  }

  if (command === "preset") {
    if (argv.includes("--list")) {
      const externalPresets = argValue(argv, "--from", "") ? loadExternalPresets(argValue(argv, "--from", ""), { expectedSha256: argValue(argv, "--from-sha256", "") }) : [];
      let presets = queryStarterPresets({
        category: argValue(argv, "--category", ""),
        ecosystem: argValue(argv, "--ecosystem", ""),
        search: argValue(argv, "--search", ""),
        externalPresets
      });
      if (argv.includes("--rank")) presets = rankStarterPresets(presets, { telemetrySignals: argv.includes("--telemetry-score") });
      if (argv.includes("--json")) console.log(JSON.stringify(presets, null, 2));
      else presets.forEach((p) => console.log(`- ${p.id} [${p.category}/${p.maturity}]: ${p.description}`));
      return 0;
    }
    const name = argValue(argv, "--name", "");
    const projectName = findPresetProjectArg(argv);
    if (!name || !projectName) throw new Error("Usage: super-app preset --name <preset> <project-name> [--run] [--with-docs-site] [--shell <bash|powershell|cmd>] [--json]");
    const externalPresets = argValue(argv, "--from", "") ? loadExternalPresets(argValue(argv, "--from", ""), { expectedSha256: argValue(argv, "--from-sha256", "") }) : [];
    const result = scaffoldFromPreset(projectName, name, argv.includes("--run"), {}, externalPresets, { includeDocsSite: argv.includes("--with-docs-site") });
    formatResult(result, argValue(argv, "--shell", ""), argv.includes("--json"));
    return 0;
  }

  if (command === "catalog") {
    const catalog = researchCatalog();
    if (argv.includes("--json")) console.log(JSON.stringify(catalog, null, 2));
    else catalog.frameworks.forEach((item) => console.log(`- ${item.id} [${item.category}] ecosystem=${item.ecosystem}`));
    return 0;
  }

  if (command === "design") {
    const design = designGuidance(argValue(argv, "--theme", "calm_pro"));
    if (argv.includes("--json")) console.log(JSON.stringify(design, null, 2));
    else console.log(`${design.theme}: ${design.vibe}`);
    return 0;
  }

  if (command === "security") {
    const report = securityPolicyReport(argValue(argv, "--framework", "react"), parseUiArgs(argv), argValue(argv, "--package-manager", "npm"), argv.includes("--run-intent"));
    if (argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else console.log(`Security score: ${report.score}`);
    return 0;
  }

  if (command === "install-hints") {
    const hints = installHints();
    if (argv.includes("--json")) console.log(JSON.stringify(hints, null, 2));
    else Object.entries(hints).forEach(([manager, cmd]) => console.log(`- ${manager}: ${cmd}`));
    return 0;
  }

  if (command === "starter") {
    const name = argv[1];
    if (!name) throw new Error("Project name is required for starter command");
    const result = scaffoldStarterApp(name, argValue(argv, "--framework", "react"), parseUiArgs(argv), argValue(argv, "--package-manager", "npm"), argv.includes("--run"), argValue(argv, "--theme", "calm_pro"), [], { includeDocsSite: argv.includes("--with-docs-site") });
    formatResult(result, argValue(argv, "--shell", ""), argv.includes("--json"));
    return 0;
  }

  printHelp();
  throw new Error(`Unknown command: ${command}`);
}

function runCli() {
  try { process.exit(main()); }
  catch (error) { console.error(error.message); process.exit(1); }
}

if (import.meta.url === `file://${process.argv[1]}`) runCli();

export { main, runCli };
