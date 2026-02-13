import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash, createPublicKey, verify as verifySignature } from "node:crypto";

export class Task { constructor(title, done = false) { this.title = title; this.done = done; } }
export class Goal { constructor(name, priority, tasks = []) { this.name = name; this.priority = priority; this.tasks = tasks; } }

export class SuperApp {
  constructor() { this.goals = []; }
  addGoal(name, priority) {
    if (!name || !name.trim()) throw new Error("Goal name cannot be empty");
    if (priority < 1 || priority > 5) throw new Error("Priority must be between 1 and 5");
    const goal = new Goal(name.trim(), priority, []); this.goals.push(goal); return goal;
  }
  addTask(goalName, taskTitle) {
    if (!taskTitle || !taskTitle.trim()) throw new Error("Task title cannot be empty");
    const goal = this.#findGoal(goalName);
    const task = new Task(taskTitle.trim(), false); goal.tasks.push(task); return task;
  }
  completeTask(goalName, taskTitle) {
    const goal = this.#findGoal(goalName);
    const found = goal.tasks.find((task) => task.title === taskTitle);
    if (!found) throw new Error(`Task '${taskTitle}' not found in goal '${goalName}'`);
    found.done = true;
  }
  listGoals() { return [...this.goals].sort((a, b) => a.priority - b.priority); }
  save(path) { fs.writeFileSync(path, JSON.stringify({ goals: this.goals }, null, 2), "utf-8"); }
  static load(path) {
    const app = new SuperApp();
    const payload = JSON.parse(fs.readFileSync(path, "utf-8"));
    app.goals = (payload.goals || []).map((goal) => new Goal(goal.name, goal.priority, (goal.tasks || []).map((task) => new Task(task.title, task.done))));
    return app;
  }
  #findGoal(goalName) {
    const goal = this.goals.find((item) => item.name === goalName);
    if (!goal) throw new Error(`Goal '${goalName}' does not exist`);
    return goal;
  }
}

export const FRAMEWORKS = {
  react: { starter: "create-vite {name} --template react-ts", ecosystem: "node", category: "frontend" },
  vue: { starter: "create-vite {name} --template vue-ts", ecosystem: "node", category: "frontend" },
  svelte: { starter: "create-vite {name} --template svelte-ts", ecosystem: "node", category: "frontend" },
  solid: { starter: "create-vite {name} --template solid-ts", ecosystem: "node", category: "frontend" },
  angular: { starter: "@angular/cli@latest new {name} --defaults --skip-git", ecosystem: "node", category: "frontend" },
  next: { starter: "create-next-app@latest {name} --ts --eslint --app --use-npm", ecosystem: "node", category: "fullstack" },
  nuxt: { starter: "nuxi@latest init {name}", ecosystem: "node", category: "fullstack" },
  remix: { starter: "create-remix@latest {name}", ecosystem: "node", category: "fullstack" },
  astro: { starter: "create-astro@latest {name}", ecosystem: "node", category: "frontend" },
  qwik: { starter: "create-qwik@latest {name}", ecosystem: "node", category: "frontend" },
  gatsby: { starter: "gatsby@latest new {name}", ecosystem: "node", category: "frontend" },
  deno_fresh: { starter: "create-fresh@latest {name}", ecosystem: "deno", category: "fullstack" }
};

export const UI_LIBS = {
  tailwind: { install: "{pm} add -D tailwindcss postcss autoprefixer", ecosystems: ["node", "deno"] },
  mui: { install: "{pm} add @mui/material @emotion/react @emotion/styled", ecosystems: ["node"] },
  antd: { install: "{pm} add antd", ecosystems: ["node"] },
  chakra: { install: "{pm} add @chakra-ui/react @emotion/react", ecosystems: ["node"] },
  bootstrap: { install: "{pm} add bootstrap", ecosystems: ["node"] },
  mantine: { install: "{pm} add @mantine/core @mantine/hooks", ecosystems: ["node"] },
  shadcn: { install: "npx shadcn@latest init", ecosystems: ["node"] },
  radix: { install: "{pm} add @radix-ui/react-icons @radix-ui/react-dialog", ecosystems: ["node"] },
  daisyui: { install: "{pm} add -D daisyui", ecosystems: ["node"] },
  fluent: { install: "{pm} add @fluentui/react-components", ecosystems: ["node"] },
  primer: { install: "{pm} add @primer/react", ecosystems: ["node"] },
  primevue: { install: "{pm} add primevue", ecosystems: ["node"] }
};

export const PM_RUNNERS = { npm: { runner: "npx", ecosystem: "node" }, pnpm: { runner: "pnpm dlx", ecosystem: "node" }, yarn: { runner: "yarn dlx", ecosystem: "node" }, bun: { runner: "bunx", ecosystem: "node" }, deno: { runner: "", ecosystem: "deno" } };
export const INSTALL_HINTS = { npm: "npm i -g super-app-cli", pnpm: "pnpm add -g super-app-cli", yarn: "yarn global add super-app-cli", bun: "bun add -g super-app-cli", deno: "deno install -A -n super-app jsr:@super/app-cli", brew: "brew install super-app", scoop: "scoop install super-app", choco: "choco install super-app" };

const THEME_PRESETS = {
  neon_noir: { palette: ["#0B1021", "#7C3AED", "#06B6D4", "#F472B6"], vibe: "High-contrast cyberpunk with focused call-to-action accents" },
  calm_pro: { palette: ["#0F172A", "#334155", "#22C55E", "#F8FAFC"], vibe: "Low-cognitive-load productivity theme with soft hierarchy" },
  sunrise_flow: { palette: ["#1E293B", "#FB7185", "#F59E0B", "#FEF3C7"], vibe: "Warm motivational flow optimized for onboarding confidence" }
};

const CI_TEMPLATES = {
  node_basic: { filename: ".github/workflows/ci.yml", content: `name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      - run: npm ci\n      - run: npm test\n` },
  node_security: { filename: ".github/workflows/security.yml", content: `name: Security\non: [push, pull_request]\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      - run: npm ci\n      - run: npm audit --audit-level=high\n` }
};

export const STARTER_PRESETS = {
  saas: { category: "product", maturity: "stable", description: "SaaS web app starter", framework: "next", packageManager: "npm", ui: ["tailwind", "radix"], theme: "calm_pro", ciTemplates: ["node_basic", "node_security"], researchNotes: "Popular SaaS baseline." },
  dashboard: { category: "internal-tools", maturity: "stable", description: "Internal dashboard", framework: "react", packageManager: "pnpm", ui: ["tailwind", "mantine"], theme: "neon_noir", ciTemplates: ["node_basic"], researchNotes: "Fast admin UI delivery." },
  commerce: { category: "product", maturity: "stable", description: "Commerce storefront", framework: "nuxt", packageManager: "npm", ui: ["tailwind", "daisyui"], theme: "sunrise_flow", ciTemplates: ["node_basic", "node_security"], researchNotes: "SEO-focused storefront baseline." },
  docs_portal: { category: "content", maturity: "stable", description: "Technical docs portal", framework: "astro", packageManager: "pnpm", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "Content-first architecture." },
  design_system: { category: "frontend-platform", maturity: "advanced", description: "Design system starter", framework: "react", packageManager: "pnpm", ui: ["tailwind", "radix", "shadcn"], theme: "calm_pro", ciTemplates: ["node_basic", "node_security"], researchNotes: "Accessible component primitives." },
  ai_playground: { category: "ai", maturity: "emerging", description: "AI experimentation starter", framework: "next", packageManager: "npm", ui: ["tailwind", "primer"], theme: "neon_noir", ciTemplates: ["node_basic", "node_security"], researchNotes: "Rapid AI prototyping." },
  realtime_hub: { category: "realtime", maturity: "emerging", description: "Realtime frontend hub", framework: "svelte", packageManager: "pnpm", ui: ["tailwind"], theme: "sunrise_flow", ciTemplates: ["node_basic"], researchNotes: "Interaction-heavy UI baseline." },
  deno_api_edge: { category: "edge", maturity: "experimental", description: "Fresh edge starter", framework: "deno_fresh", packageManager: "deno", ui: ["tailwind"], theme: "calm_pro", ciTemplates: ["node_basic"], researchNotes: "Edge-first delivery model." }
};

export function designGuidance(theme = "calm_pro") {
  const selected = THEME_PRESETS[theme] || THEME_PRESETS.calm_pro;
  return { theme, palette: selected.palette, vibe: selected.vibe,
    psychology: ["Use progressive disclosure to reduce overwhelm for new users", "Keep primary actions visually consistent to improve decision speed", "Favor legible spacing and short labels for developer ergonomics"],
    developerExperience: ["Include copy-pasteable commands and sensible defaults", "Prefer strict validation errors with actionable hints", "Expose machine-readable JSON outputs for automation"] };
}

function validateProjectName(projectName) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-_]{1,62}$/.test(projectName)) throw new Error("Invalid project name. Use 2-63 chars: letters, numbers, dash, underscore.");
}

function normalizePreset(id, preset) {
  const required = ["category", "maturity", "description", "framework", "packageManager", "ui", "theme", "ciTemplates", "researchNotes"];
  for (const key of required) if (!(key in preset)) throw new Error(`Invalid preset '${id}': missing ${key}`);
  if (!FRAMEWORKS[preset.framework]) throw new Error(`Invalid preset '${id}': unknown framework '${preset.framework}'`);
  if (!PM_RUNNERS[preset.packageManager]) throw new Error(`Invalid preset '${id}': unknown package manager '${preset.packageManager}'`);
  return {
    id,
    trust: preset.trust || { level: "community", signed: false, publisher: "unknown" },
    popularity: preset.popularity || 0.5,
    maintenance: preset.maintenance || 0.5,
    ...preset
  };
}

function maturityWeight(maturity) {
  if (maturity === "stable") return 1;
  if (maturity === "advanced") return 0.85;
  if (maturity === "emerging") return 0.65;
  return 0.45;
}

export function scorePreset(preset) {
  const trustBoost = preset.trust?.signed ? 0.15 : 0;
  const base = (maturityWeight(preset.maturity) * 0.4) + (preset.popularity * 0.3) + (preset.maintenance * 0.3) + trustBoost;
  return Math.min(1, Number(base.toFixed(3)));
}

export function computeFileSha256(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

export function verifyPresetFileIntegrity(filePath, expectedSha256 = "") {
  if (!expectedSha256) return { verified: false, reason: "No hash provided" };
  const actual = computeFileSha256(filePath);
  if (actual !== expectedSha256) throw new Error(`Preset file integrity check failed. Expected ${expectedSha256}, got ${actual}`);
  return { verified: true, sha256: actual };
}

function runSignatureProviderCommand(command, args, commandRunner = spawnSync) {
  const run = commandRunner(command, args, { encoding: "utf-8" });
  if (run.error) {
    if (run.error.code === "ENOENT") throw new Error(`${command} is not installed. Install it or switch --preset-signature-provider.`);
    throw new Error(`Signature provider command failed to start: ${run.error.message}`);
  }
  if (run.status !== 0) {
    const details = `${run.stderr || ""}${run.stdout || ""}`.trim();
    throw new Error(`Preset signature verification failed via ${command}.${details ? ` Details: ${details}` : ""}`);
  }
}

function verifySignatureWithExternalProvider(filePath, signaturePath, publicKeyPath, provider, commandRunner = spawnSync) {
  if (!signaturePath || !publicKeyPath) {
    throw new Error(`Both signature file and public key file are required for ${provider} verification.`);
  }

  if (provider === "minisign") {
    runSignatureProviderCommand("minisign", ["-V", "-m", filePath, "-x", signaturePath, "-p", publicKeyPath], commandRunner);
    return { verified: true, provider, signaturePath, publicKeyPath };
  }

  if (provider === "cosign-blob") {
    runSignatureProviderCommand("cosign", ["verify-blob", "--key", publicKeyPath, "--signature", signaturePath, filePath], commandRunner);
    return { verified: true, provider, signaturePath, publicKeyPath };
  }

  throw new Error(`Unsupported signature provider: ${provider}`);
}

export function verifyPresetSignatureFile(filePath, signaturePath = "", publicKeyPath = "", provider = "rsa-pem", options = {}) {
  if (provider === "none") return { verified: false, reason: "Signature provider disabled" };

  if (provider === "sha256-file") {
    if (!signaturePath) throw new Error("Signature file path is required for sha256-file verification.");
    const expected = fs.readFileSync(signaturePath, "utf-8").trim().split(/\s+/)[0];
    const actual = computeFileSha256(filePath);
    if (expected !== actual) throw new Error(`Preset signature verification failed for sha256-file provider. Expected ${expected}, got ${actual}`);
    return { verified: true, provider, algorithm: "sha256", signaturePath };
  }

  if (["minisign", "cosign-blob"].includes(provider)) {
    return verifySignatureWithExternalProvider(filePath, signaturePath, publicKeyPath, provider, options.commandRunner);
  }

  if (!signaturePath && !publicKeyPath) return { verified: false, reason: "No signature verification requested" };
  if (!signaturePath || !publicKeyPath) throw new Error("Both signature file and public key file are required for rsa-pem verification.");

  const payload = fs.readFileSync(filePath);
  const signature = fs.readFileSync(signaturePath);
  const publicKey = createPublicKey(fs.readFileSync(publicKeyPath, "utf-8"));
  const ok = verifySignature("sha256", payload, publicKey, signature);
  if (!ok) throw new Error("Preset signature verification failed.");
  return { verified: true, provider: "rsa-pem", algorithm: "sha256", signaturePath, publicKeyPath };
}

export function loadExternalPresets(filePath, expectedSha256 = "", signaturePath = "", publicKeyPath = "", signatureProvider = "rsa-pem", options = {}) {
  verifyPresetFileIntegrity(filePath, expectedSha256);
  verifyPresetSignatureFile(filePath, signaturePath, publicKeyPath, signatureProvider, options);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const map = Array.isArray(raw) ? Object.fromEntries(raw.map((p) => [p.id, p])) : raw;
  const out = {};
  for (const [id, preset] of Object.entries(map)) out[id] = normalizePreset(id, preset);
  return out;
}

function mergedPresets(options = {}) {
  const local = Object.fromEntries(Object.entries(STARTER_PRESETS).map(([id, p]) => [id, normalizePreset(id, p)]));
  return { ...local, ...(options.externalPresets || {}) };
}

export function buildBootFiles(projectName, withDocsSite = false) {
  const files = [
    { filename: "README.generated.md", content: `# ${projectName}\n\nGenerated by Super App preset workflow.\n` },
    { filename: ".editorconfig", content: "root = true\n[*]\nindent_style = space\nindent_size = 2\n" }
  ];
  if (withDocsSite) {
    files.push({ filename: "docs/index.md", content: `# ${projectName} Documentation\n\nStart documenting your project here.\n` });
    files.push({ filename: "docs/architecture.md", content: "# Architecture\n\nDescribe components, data flow, and deployment model.\n" });
  }
  return files;
}

export function researchCatalog() { return { frameworks: Object.entries(FRAMEWORKS).map(([id, data]) => ({ id, ...data })), uiLibraries: Object.entries(UI_LIBS).map(([id, data]) => ({ id, ...data })), packageManagers: Object.entries(PM_RUNNERS).map(([id, data]) => ({ id, ...data })) }; }
export function listStarterPresets(options = {}) { return Object.values(mergedPresets(options)).map((preset) => ({ ...preset, score: scorePreset(preset) })); }

export function queryStarterPresets(filters = {}, options = {}) {
  const { category, ecosystem, search, minScore } = filters;
  return listStarterPresets(options).filter((preset) => {
    if (category && preset.category !== category) return false;
    if (ecosystem && FRAMEWORKS[preset.framework].ecosystem !== ecosystem) return false;
    if (minScore && preset.score < minScore) return false;
    if (search) {
      const hay = `${preset.id} ${preset.description} ${preset.researchNotes}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });
}

export function getCiTemplates(keys) { return keys.map((key) => { if (!CI_TEMPLATES[key]) throw new Error(`Unknown CI template: ${key}`); return { id: key, ...CI_TEMPLATES[key] }; }); }

function ensureCompatibility(framework, uiComponents, packageManager) {
  const frameworkData = FRAMEWORKS[framework];
  const pmData = PM_RUNNERS[packageManager];
  if (!frameworkData) throw new Error(`Unsupported framework: ${framework}`);
  if (!pmData) throw new Error(`Unsupported package manager: ${packageManager}`);
  if (frameworkData.ecosystem !== pmData.ecosystem) throw new Error(`Incompatible package manager '${packageManager}' for framework '${framework}'`);
  for (const ui of uiComponents) {
    const uiData = UI_LIBS[ui];
    if (!uiData) throw new Error(`Unsupported UI component/library: ${ui}`);
    if (!uiData.ecosystems.includes(frameworkData.ecosystem)) throw new Error(`UI component/library '${ui}' is not compatible with ${frameworkData.ecosystem}`);
  }
  return frameworkData;
}

export function securityPolicyReport(framework, uiComponents, packageManager, runCommands = false) {
  const frameworkData = ensureCompatibility(framework, uiComponents, packageManager);
  return { score: runCommands ? 85 : 92,
    checks: [
      { id: "ecosystem_compatibility", status: "pass", detail: `Framework ecosystem '${frameworkData.ecosystem}' matches package manager '${packageManager}'.` },
      { id: "ui_compatibility", status: "pass", detail: `All ${uiComponents.length} UI libraries are compatible.` },
      { id: "run_mode", status: runCommands ? "warn" : "pass", detail: runCommands ? "Command execution is enabled; review commands before running." : "Safe preview mode enabled (no execution)." }
    ],
    recommendations: ["Pin framework generator versions when possible.", "Run npm/pnpm/yarn audit (or equivalent) after scaffold.", "Use lockfiles and CI dependency scanning.", "Enable secret scanning and code scanning in GitHub settings."] };
}

export function generateScaffoldPlan(projectName, framework, uiComponents, packageManager, theme = "calm_pro") {
  validateProjectName(projectName);
  const frameworkData = ensureCompatibility(framework, uiComponents, packageManager);
  const pmData = PM_RUNNERS[packageManager];
  const steps = [pmData.runner ? `${pmData.runner} ${frameworkData.starter.replace("{name}", projectName)}` : frameworkData.starter.replace("{name}", projectName), `cd ${projectName}`];
  if (pmData.ecosystem === "node") steps.push(packageManager === "npm" ? "npm install" : `${packageManager} install`);
  for (const ui of uiComponents) steps.push(UI_LIBS[ui].install.replaceAll("{pm}", packageManager));
  const design = designGuidance(theme);
  steps.push(`# Theme preset: ${theme}`);
  steps.push(`# Palette: ${design.palette.join(", ")}`);
  return steps;
}

export function scaffoldStarterApp(projectName, framework, uiComponents, packageManager, runCommands, theme = "calm_pro", ciTemplates = [], options = {}) {
  const result = {
    projectName, framework, uiComponents, packageManager, theme,
    design: designGuidance(theme), security: securityPolicyReport(framework, uiComponents, packageManager, runCommands), ciTemplates: getCiTemplates(ciTemplates),
    generatedFiles: buildBootFiles(projectName, options.withDocsSite || false),
    commands: generateScaffoldPlan(projectName, framework, uiComponents, packageManager, theme), executed: false
  };
  if (!runCommands) return result;
  for (const command of result.commands) {
    if (command.startsWith("#")) continue;
    const run = spawnSync(command, { shell: true, stdio: "inherit" });
    if (run.status !== 0) throw new Error(`Scaffold command failed: ${command}`);
  }
  result.executed = true;
  return result;
}

export function scaffoldFromPreset(projectName, presetName, runCommands = false, overrides = {}, options = {}) {
  const presets = mergedPresets(options);
  const preset = presets[presetName];
  if (!preset) throw new Error(`Unknown preset: ${presetName}`);
  return scaffoldStarterApp(projectName, overrides.framework || preset.framework, overrides.ui || preset.ui, overrides.packageManager || preset.packageManager, runCommands, overrides.theme || preset.theme, preset.ciTemplates, { withDocsSite: options.withDocsSite || false });
}

export function installHints() { return { ...INSTALL_HINTS }; }


export function phase7ExecutionPlan() {
  return {
    phase: 7,
    status: "in_progress",
    mission: "Deliver a collaborative web UI with reliable sync and developer-friendly notifications.",
    tracks: [
      {
        id: "web_ui_foundation",
        title: "Web UI foundation",
        outcomes: [
          "Goal and preset workflows available in browser",
          "Shareable starter plans with JSON export",
          "Accessible design tokens aligned with theme presets"
        ],
        milestones: [
          { id: "ui_command_surface", title: "Expose Phase 7 CLI surface", done: true },
          { id: "ui_http_api", title: "Add HTTP API for goals and presets", done: true },
          { id: "ui_frontend_shell", title: "Ship first browser shell", done: true }
        ]
      },
      {
        id: "multi_user_sync",
        title: "Multi-user sync",
        outcomes: [
          "Workspace model with role-based access",
          "Conflict-aware sync strategy for edits",
          "Audit trail for preset and goal changes"
        ],
        milestones: [
          { id: "sync_domain_model", title: "Define workspace domain model", done: true },
          { id: "sync_strategy", title: "Implement conflict-aware merge rules", done: true },
          { id: "sync_audit", title: "Persist change/audit trail", done: true }
        ]
      },
      {
        id: "notifications",
        title: "Notifications and reminders",
        outcomes: [
          "In-app reminders for goals/tasks",
          "Digest and webhook channels for teams",
          "Preference center for notification noise control"
        ],
        milestones: [
          { id: "notify_scheduler", title: "Introduce reminder scheduler", done: true },
          { id: "notify_channels", title: "Add digest/webhook channels", done: true },
          { id: "notify_preferences", title: "Add user notification preferences", done: true }
        ]
      },
      {
        id: "agentic_contribution",
        title: "Professional agentic coding contribution flow",
        outcomes: [
          "AI/agent changes require reproducible tests and clear rollback notes",
          "Security checks for generated scaffold commands",
          "Contributor guidance for human + agent collaboration"
        ],
        milestones: [
          { id: "agentic_guidelines", title: "Publish professional agentic contribution guidance", done: true },
          { id: "agentic_pr_template", title: "Add explicit agent validation checklist", done: true },
          { id: "agentic_policy_checks", title: "Add CI checks for generated command safety", done: true }
        ]
      }
    ]
  };
}

export function phase7StatusReport() {
  const plan = phase7ExecutionPlan();
  const tracks = plan.tracks.map((track) => {
    const total = track.milestones.length;
    const done = track.milestones.filter((m) => m.done).length;
    const completion = Number(((done / total) * 100).toFixed(1));
    return { id: track.id, title: track.title, done, total, completion };
  });
  const totalMilestones = tracks.reduce((sum, t) => sum + t.total, 0);
  const doneMilestones = tracks.reduce((sum, t) => sum + t.done, 0);
  const completion = Number(((doneMilestones / totalMilestones) * 100).toFixed(1));
  return {
    phase: plan.phase,
    status: plan.status,
    mission: plan.mission,
    doneMilestones,
    totalMilestones,
    completion,
    tracks
  };
}



export function phase7NextActions(limit = 3) {
  const plan = phase7ExecutionPlan();
  const pending = [];
  for (const track of plan.tracks) {
    for (const milestone of track.milestones) {
      if (!milestone.done) pending.push({
        trackId: track.id,
        trackTitle: track.title,
        milestoneId: milestone.id,
        title: milestone.title
      });
    }
  }
  return {
    phase: plan.phase,
    status: plan.status,
    count: Math.min(Math.max(limit, 1), pending.length),
    actions: pending.slice(0, Math.max(limit, 1))
  };
}



export function phase7ApiBlueprint() {
  return {
    phase: 7,
    version: "v0.1",
    auth: {
      strategy: "token",
      notes: [
        "Use scoped API tokens for CLI and web sessions",
        "Require workspace membership for write operations"
      ]
    },
    endpoints: [
      { method: "GET", path: "/api/v1/goals", purpose: "List goals for workspace", roles: ["viewer", "editor", "owner"] },
      { method: "POST", path: "/api/v1/goals", purpose: "Create goal", roles: ["editor", "owner"] },
      { method: "POST", path: "/api/v1/goals/:goalId/tasks", purpose: "Create task on goal", roles: ["editor", "owner"] },
      { method: "PATCH", path: "/api/v1/goals/:goalId/tasks/:taskId", purpose: "Update task status/details", roles: ["editor", "owner"] },
      { method: "GET", path: "/api/v1/presets", purpose: "Query starter presets", roles: ["viewer", "editor", "owner"] },
      { method: "POST", path: "/api/v1/presets/validate", purpose: "Validate external preset pack and signatures", roles: ["editor", "owner"] },
      { method: "GET", path: "/api/v1/phase7/status", purpose: "Get phase progress summary", roles: ["viewer", "editor", "owner"] }
    ],
    securityChecks: [
      "Validate project and workspace identifiers",
      "Verify signature provider settings before preset ingestion",
      "Write audit events for goal/preset mutations"
    ]
  };
}



export function phase7DeveloperBrief() {
  const status = phase7StatusReport();
  const next = phase7NextActions(5);
  const api = phase7ApiBlueprint();

  const trackRows = status.tracks
    .map((track) => `| ${track.title} | ${track.done}/${track.total} | ${track.completion}% |`)
    .join("\n");

  const nextRows = next.actions
    .map((action, index) => `${index + 1}. **${action.trackTitle}** — ${action.title}`)
    .join("\n");

  const endpointRows = api.endpoints
    .map((endpoint) => `- \`${endpoint.method} ${endpoint.path}\` — ${endpoint.purpose}`)
    .join("\n");

  return {
    phase: status.phase,
    completion: status.completion,
    markdown: `# Phase ${status.phase} Developer Brief

` +
      `**Mission:** ${status.mission}

` +
      `## Progress Board

` +
      `| Track | Milestones Done | Completion |
` +
      `|---|---:|---:|
` +
      `${trackRows}

` +
      `## Next Prioritized Actions

` +
      `${nextRows || "No pending actions."}

` +
      `## API Blueprint Snapshot (${api.version})

` +
      `${endpointRows}

` +
      `## Security Guardrails

` +
      `${api.securityChecks.map((check) => `- ${check}`).join("\n")}
`
  };
}



export function phase7RiskRegister() {
  return {
    phase: 7,
    risks: [
      {
        id: "api_scope_drift",
        area: "web_ui_foundation",
        level: "high",
        impact: "API changes could break CLI/web compatibility if contracts are unstable.",
        mitigation: "Freeze v0.1 contract and add contract tests before server rollout."
      },
      {
        id: "sync_conflict_data_loss",
        area: "multi_user_sync",
        level: "high",
        impact: "Concurrent edits can overwrite tasks/goals without merge strategy.",
        mitigation: "Define conflict policy and store audit trail for every mutation."
      },
      {
        id: "notification_fatigue",
        area: "notifications",
        level: "medium",
        impact: "Excessive reminders can reduce trust and disable engagement.",
        mitigation: "Default to digest mode and provide strict preference controls."
      },
      {
        id: "unsafe_generated_commands",
        area: "agentic_contribution",
        level: "high",
        impact: "Generated command suggestions may introduce security or supply-chain risk.",
        mitigation: "Require explicit security review checklist and pinned generator versions."
      }
    ]
  };
}



export function phase7CompletionReport() {
  const status = phase7StatusReport();
  return {
    phase: 7,
    status: status.completion === 100 ? "done" : "in_progress",
    completion: status.completion,
    summary: status.completion === 100
      ? "Phase 7 planning deliverables are complete: web UI plan, sync policy, notifications policy, API/security/governance artifacts."
      : "Phase 7 still has remaining milestones.",
    tracks: status.tracks
  };
}

export function demo() {
  const app = new SuperApp();
  app.addGoal("Launch MVP", 1); app.addTask("Launch MVP", "Build core features"); app.addTask("Launch MVP", "Write tests"); app.completeTask("Launch MVP", "Build core features");
  console.log("=== Super App Demo ===");
  for (const goal of app.listGoals()) {
    console.log(`Goal: ${goal.name} (priority ${goal.priority})`);
    for (const task of goal.tasks) console.log(`  [${task.done ? "x" : " "}] ${task.title}`);
  }
}
