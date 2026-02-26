# Super App (Node.js)

Super App is an open-source **Node.js toolkit** with one CLI for:
1. Goal/task planning with local JSON persistence.
2. Dev-friendly starter app scaffolding plans for many frameworks and UI libraries.
3. Design guidance presets for visually unique and psychologically appealing product directions.
4. Security policy checks to catch risky scaffold combinations and execution intent early.
5. Reusable starter presets with deep-research metadata and CI template snippets.
6. Cross-platform script output (bash, PowerShell, cmd) and a developer environment doctor command.
7. Policy-as-code checks (`policy-check`) to enforce organization scaffold guardrails before execution.

## Included capabilities

- Goal planning with priorities
- Task tracking and completion
- Save/load to JSON
- Starter setup plans for frameworks:
  - React, Vue, Svelte, Solid, Angular, Next.js
  - Nuxt, Remix, Astro, Qwik, Gatsby, Fresh (Deno)
- Optional UI libraries/components:
  - Tailwind, MUI, Ant Design, Chakra UI, Bootstrap
  - Mantine, shadcn/ui, Radix UI, daisyUI, Fluent UI, Primer, PrimeVue
- Package manager support:
  - npm, pnpm, yarn, bun, deno
- Compatibility-aware planning:
  - Framework ↔ package-manager ecosystem checks
  - Deno Fresh run-ready command generation (`deno run -A -r jsr:@fresh/create`)
  - UI library ↔ ecosystem compatibility checks
- Security-aware planning:
  - Project name validation to reduce command-injection/path traversal risk
  - Windows reserved-name validation for cross-platform safety
  - Security policy report command (`security`) with hardening recommendations
- Cross-platform and production-ready ergonomics:
  - Script output selection for `bash`, `powershell`, or `cmd` via `--shell`
  - `doctor` command to detect OS/shell and package manager availability
- Preset mode:
  - `preset --list` for discovery
  - `preset --list --category <name> --ecosystem <node|deno> --search <term> [--from <file>] [--from-sha256 <hex>] [--rank] [--telemetry-score]` for deep research filtering + external preset files
  - `preset --name <preset> <project> [--from <file>] [--from-sha256 <hex>] [--with-docs-site]` for one-command starter planning (supports external preset packs)
  - Built-in CI workflow templates included in output
  - Expanded categories: product, internal-tools, content, frontend-platform, ai, realtime, edge

## Quick start

```bash
npm test
node bin/super-app.js --help
node bin/super-app.js catalog --json
node bin/super-app.js doctor --json
node bin/super-app.js reminder --platform linux --json
node bin/super-app.js profile --user dev_team --json
node bin/super-app.js sync --user dev_team --provider gitlab --json
node bin/super-app.js policy-check --file ./policy.json --framework react --package-manager pnpm --ui tailwind --json
node bin/super-app.js security --framework react --package-manager npm --ui tailwind --json
node bin/super-app.js preset --list --json
node bin/super-app.js preset --list --category ai --json
node bin/super-app.js preset --list --rank --json
node bin/super-app.js preset --list --rank --telemetry-score --json
node bin/super-app.js preset --list --from ./presets.json --from-sha256 <sha256> --json
node bin/super-app.js preset --name saas my-saas
node bin/super-app.js preset --name external my-app --from ./presets.json --from-sha256 <sha256> --with-docs-site --json
```
CLI highlights:
- `super-app doctor [--json]` shows local environment health for Node + package managers.
- `super-app doctor --refresh` forces re-detection instead of using cached process results.
- `super-app reminder [--platform <linux|macos|windows>]` prints scheduler guidance for recurring checks.
- `super-app profile --user <id>` prints per-user workspace paths for local multi-user separation.
- `super-app sync --user <id>` prints provider-aware git sync steps for remote backup/sync workflows.
- `super-app policy-check --file <policy.json>` evaluates framework/UI/package-manager choices against policy-as-code rules and returns exit code `2` when policy fails.
- `super-app starter ... --shell <bash|powershell|cmd>` prints shell-specific scripts for any OS terminal.
- `super-app preset --name <preset> <project> --shell <bash|powershell|cmd>` does the same for presets.
- Scaffold results include `bootFiles`, and `--with-docs-site` adds a generated `docs/index.md` starter file.

## Open source project files

- [LICENSE](LICENSE)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

## GitHub growth plan

For long-term adoption strategy, see:
- [`docs/GITHUB_GROWTH_PLAYBOOK.md`](docs/GITHUB_GROWTH_PLAYBOOK.md)

## Project goals

See [GOALS.md](GOALS.md) for roadmap phases.
