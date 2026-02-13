# Super App (Node.js)

> Open-source CLI for researching modern stacks, scaffolding starter apps, and executing Phase 7 roadmap work with clear, security-aware outputs.

## At a glance

| Area | What you get |
|---|---|
| Starter generation | Framework + UI + package manager planning with safe preview mode |
| Research mode | Catalogs, preset scoring, filters, and external preset pack support |
| Security | Integrity checks (SHA256), signatures (RSA/minisign/cosign), policy reports |
| Phase 7 execution | Plan, status, next actions, API blueprint, and developer brief commands |

## Install

```bash
npm install
npm link
super-app --help
sp --help
```

## Fast start (developer-friendly)

```bash
super-app init my-saas --preset saas
super-app preset --list --category ai --min-score 0.6 --json
super-app security --framework react --package-manager npm --ui tailwind --json
```

## Command map

| Command | Purpose |
|---|---|
| `super-app init <project> --preset <name>` | Fast scaffold from preset |
| `super-app preset --list ...` | Discover/filter presets |
| `super-app starter <project> ...` | Direct scaffold planning |
| `super-app catalog --json` | Research frameworks/UI/package managers |
| `super-app security ... --json` | Security policy report for selected stack |
| `super-app phase7-plan --json` | Full Phase 7 plan and milestones |
| `super-app phase7-status --json` | Track completion percentages |
| `super-app phase7-next --limit 3 --json` | Prioritized remaining actions |
| `super-app phase7-api --json` | Secure HTTP/API blueprint |
| `super-app phase7-brief` | Visual markdown brief for contributors |
| `super-app phase7-risks --json` | Risk register with mitigations for execution planning |
| `super-app phase7-complete --json` | Final completion report for Phase 7 deliverables |

## External preset packs

```bash
super-app preset --list --preset-file ./community-presets.json --json
super-app preset --name starter_lab my-app --preset-file ./community-presets.json
```

### Integrity + signature verification

```bash
super-app preset --list \
  --preset-file ./community-presets.json \
  --preset-sha256 <sha256> \
  --preset-signature ./community-presets.sig \
  --preset-public-key ./community-pubkey.pem \
  --preset-signature-provider rsa-pem \
  --json
```

Supported providers:
- `rsa-pem` (default)
- `sha256-file`
- `minisign`
- `cosign-blob`
- `none`

## Phase 7 execution center

```bash
super-app phase7-plan --json
super-app phase7-status --json
super-app phase7-next --limit 3 --json
super-app phase7-api --json
super-app phase7-brief
super-app phase7-risks --json
super-app phase7-complete --json
```

`phase7-brief` prints a visual markdown board with:
- progress table by track
- prioritized next milestones
- API snapshot
- security guardrails

`phase7-risks` highlights high-priority delivery risks with mitigations so teams can plan safely.

Use `phase7-complete` to confirm if all Phase 7 milestones are done with a final progress summary.

## Agentic coding contributions (professional)

Super App supports human + agent collaboration. Keep contributions professional:
- small, reversible diffs
- reproducible tests and CLI checks
- explicit security implications for generated commands
- rollback notes for risky changes

## Open source files

- [LICENSE](LICENSE)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

## Roadmap

See [GOALS.md](GOALS.md).
