#!/usr/bin/env node
import {
  FRAMEWORKS,
  PM_RUNNERS,
  UI_LIBS,
  demo,
  designGuidance,
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
  researchCatalog,
  scaffoldFromPreset,
  scaffoldStarterApp,
  securityPolicyReport
} from "../src/super-app.js";

function printHelp() {
  console.log(`Super App CLI

Easy commands:
  super-app init <project-name> --preset <preset> [--preset-file presets.json] [--preset-sha256 <hash>] [--preset-signature file.sig] [--preset-public-key key.pem] [--preset-signature-provider <rsa-pem|sha256-file|minisign|cosign-blob|none>] [--with-docs-site] [--run]
  super-app preset --list [--category <name>] [--ecosystem <node|deno>] [--search <term>] [--min-score <0-1>] [--preset-file presets.json] [--preset-sha256 <hash>] [--preset-signature file.sig] [--preset-public-key key.pem] [--preset-signature-provider <rsa-pem|sha256-file|minisign|cosign-blob|none>] [--json]

Full commands:
  super-app demo
  super-app install-hints [--json]
  super-app design [--theme <neon_noir|calm_pro|sunrise_flow>] [--json]
  super-app catalog [--json]
  super-app phase7-plan [--json]
  super-app phase7-status [--json]
  super-app phase7-next [--limit <n>] [--json]
  super-app phase7-api [--json]
  super-app phase7-brief [--json]
  super-app phase7-risks [--json]
  super-app phase7-complete [--json]
  super-app preset --name <preset> <project-name> [--preset-file presets.json] [--preset-sha256 <hash>] [--preset-signature file.sig] [--preset-public-key key.pem] [--preset-signature-provider <rsa-pem|sha256-file|minisign|cosign-blob|none>] [--with-docs-site] [--run] [--json]
  super-app security [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--run-intent] [--json]
  super-app starter <name> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--theme <preset>] [--with-docs-site] [--run]
`);
}

function argValue(args, key, fallback) {
  const i = args.indexOf(key);
  if (i === -1 || i + 1 >= args.length) return fallback;
  return args[i + 1];
}

function parseUiArgs(args) {
  const idx = args.indexOf("--ui");
  let ui = ["tailwind"];
  if (idx !== -1) {
    ui = [];
    for (let i = idx + 1; i < args.length && !args[i].startsWith("--"); i += 1) ui.push(args[i]);
    if (ui.length === 0) ui = ["tailwind"];
  }
  return ui;
}

function findPresetProjectArg(argv) {
  for (let i = 1; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      if (["--name", "--category", "--ecosystem", "--search", "--preset", "--preset-file", "--preset-sha256", "--preset-signature", "--preset-public-key", "--preset-signature-provider"].includes(argv[i])) i += 1;
      continue;
    }
    return argv[i];
  }
  return "";
}

function presetOptions(argv) {
  const file = argValue(argv, "--preset-file", "");
  const hash = argValue(argv, "--preset-sha256", "");
  const signatureFile = argValue(argv, "--preset-signature", "");
  const publicKeyFile = argValue(argv, "--preset-public-key", "");
  const signatureProvider = argValue(argv, "--preset-signature-provider", "rsa-pem");
  const withDocsSite = argv.includes("--with-docs-site");
  if (!file) return { withDocsSite };
  return { externalPresets: loadExternalPresets(file, hash, signatureFile, publicKeyFile, signatureProvider), withDocsSite };
}

function runPresetScaffold(argv, presetName, projectName) {
  const options = presetOptions(argv);
  const result = scaffoldFromPreset(projectName, presetName, argv.includes("--run"), {}, options);
  console.log(JSON.stringify(result, null, 2));
  return 0;
}

function main(argv = process.argv.slice(2)) {
  const command = argv[0] || "demo";
  if (command === "--help" || command === "-h") return printHelp(), 0;
  if (command === "demo") return demo(), 0;

  if (command === "init") {
    const projectName = argv[1];
    const preset = argValue(argv, "--preset", "saas");
    if (!projectName) throw new Error("Usage: super-app init <project-name> --preset <preset>");
    return runPresetScaffold(argv, preset, projectName);
  }

  if (command === "preset") {
    if (argv.includes("--list")) {
      const options = presetOptions(argv);
      const presets = queryStarterPresets({
        category: argValue(argv, "--category", ""),
        ecosystem: argValue(argv, "--ecosystem", ""),
        search: argValue(argv, "--search", ""),
        minScore: Number(argValue(argv, "--min-score", "0")) || 0
      }, options);
      if (argv.includes("--json")) console.log(JSON.stringify(presets, null, 2));
      else presets.forEach((p) => console.log(`- ${p.id} [${p.category}/${p.maturity}]: ${p.description}`));
      return 0;
    }
    const name = argValue(argv, "--name", "");
    const projectName = findPresetProjectArg(argv);
    if (!name || !projectName) throw new Error("Usage: super-app preset --name <preset> <project-name> [--run] [--json]");
    return runPresetScaffold(argv, name, projectName);
  }

  if (command === "catalog") {
    const catalog = researchCatalog();
    if (argv.includes("--json")) console.log(JSON.stringify(catalog, null, 2));
    else catalog.frameworks.forEach((item) => console.log(`- ${item.id} [${item.category}] ecosystem=${item.ecosystem}`));
    return 0;
  }

  if (command === "phase7-plan") {
    const plan = phase7ExecutionPlan();
    if (argv.includes("--json")) console.log(JSON.stringify(plan, null, 2));
    else {
      console.log(`Phase ${plan.phase} (${plan.status}): ${plan.mission}`);
      plan.tracks.forEach((track) => console.log(`- ${track.title}: ${track.outcomes[0]}`));
    }
    return 0;
  }

  if (command === "phase7-status") {
    const report = phase7StatusReport();
    if (argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Phase ${report.phase} completion: ${report.completion}% (${report.doneMilestones}/${report.totalMilestones} milestones)`);
      report.tracks.forEach((track) => console.log(`- ${track.title}: ${track.completion}% (${track.done}/${track.total})`));
    }
    return 0;
  }

  if (command === "phase7-next") {
    const next = phase7NextActions(Number(argValue(argv, "--limit", "3")) || 3);
    if (argv.includes("--json")) console.log(JSON.stringify(next, null, 2));
    else {
      console.log(`Phase ${next.phase} next actions (${next.actions.length}):`);
      next.actions.forEach((action) => console.log(`- [${action.trackTitle}] ${action.title}`));
    }
    return 0;
  }

  if (command === "phase7-api") {
    const api = phase7ApiBlueprint();
    if (argv.includes("--json")) console.log(JSON.stringify(api, null, 2));
    else {
      console.log(`Phase ${api.phase} API blueprint (${api.version})`);
      api.endpoints.forEach((e) => console.log(`- ${e.method} ${e.path} :: ${e.purpose}`));
    }
    return 0;
  }

  if (command === "phase7-brief") {
    const brief = phase7DeveloperBrief();
    if (argv.includes("--json")) console.log(JSON.stringify(brief, null, 2));
    else console.log(brief.markdown);
    return 0;
  }

  if (command === "phase7-risks") {
    const risk = phase7RiskRegister();
    if (argv.includes("--json")) console.log(JSON.stringify(risk, null, 2));
    else risk.risks.forEach((r) => console.log(`- [${r.level}] ${r.id}: ${r.mitigation}`));
    return 0;
  }

  if (command === "phase7-complete") {
    const report = phase7CompletionReport();
    if (argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(`Phase ${report.phase} status: ${report.status} (${report.completion}%)`);
      console.log(report.summary);
    }
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
    const result = scaffoldStarterApp(
      name,
      argValue(argv, "--framework", "react"),
      parseUiArgs(argv),
      argValue(argv, "--package-manager", "npm"),
      argv.includes("--run"),
      argValue(argv, "--theme", "calm_pro"),
      [],
      { withDocsSite: argv.includes("--with-docs-site") }
    );
    console.log(JSON.stringify(result, null, 2));
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
