<div align="center">

# supe.js ⚡

**supe.js is a production-oriented CLI for project scaffolding, policy checks, design guidance, and developer workflow planning.**

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Module Type](https://img.shields.io/badge/modules-ESM-1f6feb)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Why this project

supe.js helps teams bootstrap modern app stacks with sensible defaults while keeping security and compatibility in check. It combines:

- **Starter planning** for frameworks + UI libraries.
- **Safety validation** around package manager compatibility.
- **Design guidance** with theme presets and palette suggestions.
- **Workflow utilities** like environment diagnostics, sync plans, and install hints.

## Highlights

- ✅ Framework-aware scaffold planning with 20+ options (React, Next, Astro, Cloudflare Workers, Cloudflare Vinext, Deno Fresh, and more)
- ✅ Package-manager compatibility model (`npm`, `pnpm`, `yarn`, `bun`, `deno`)
- ✅ Security policy report with safe preview mode
- ✅ Expanded UI/component, animation, and mouse-interaction library catalog
- ✅ JSON output mode for automation and CI pipelines

## Installation

```bash
npm install
```

Run directly:

```bash
node bin/supe.js --help
```

Package URL: https://www.npmjs.com/package/@supejs/supejs

## CLI Reference

```text
supe demo
supe doctor [--json]
supe install-hints [--json]
supe profile --user <id> [--base-dir <path>] [--json]
supe sync --user <id> [--provider <github|gitlab|bitbucket>] [--remote <name>] [--json]
supe policy-check --file <policy.json> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--json]
supe design [--theme <neon_noir|calm_pro|sunrise_flow>] [--json]
supe catalog [--json]
supe preset [--list] [--name <preset-id>] [project-name] [--json]
supe starter <project-name> [--framework <name>] [--package-manager <pm>] [--ui <lib...>] [--json]
```

## Example workflows

### 1) Create a starter plan

```bash
node bin/supe.js starter acme-portal --framework react --package-manager pnpm --ui tailwind --json
```

### 2) Validate policy configuration

```bash
node bin/supe.js policy-check --file policy.json --framework react --package-manager npm --ui tailwind --json
```

### 3) Review design direction

```bash
node bin/supe.js design --theme neon_noir --json
```

### 4) Explore full framework/library catalog

```bash
node bin/supe.js catalog --json
```

## Publishing to npm org scope `@supejs`

If your npm organization is `supejs`, publish this package as `@supejs/supejs` so it is managed inside the org scope:

### Public visibility checklist

- Confirm package name: `@supejs/supejs`
- Keep `publishConfig.access` as `public` (safe for current config)
- Ensure npm package page is reachable after publish: `https://www.npmjs.com/package/@supejs/supejs`


```bash
npm whoami
npm test
npm pack
npm publish --dry-run --access public
```

> Note: scoped packages require public access for open-source publishing. This repo keeps `publishConfig.access` set to `public` and the workflow publishes with `--access public`.

## GitHub Actions auto-publish to npm


> Security note: never commit or paste your npm token in code, workflow files, issues, or PR comments. If a token was exposed, revoke it in npm and create a new one immediately.

This repository includes a publish workflow at `.github/workflows/publish.yml` that publishes `@supejs/supejs` when a GitHub Release is published.

1. Create an npm access token from the `supejs` npm org with publish access to `@supejs/*`.
2. Add it in GitHub repository secrets as `NPM_TOKEN` (Settings → Secrets and variables → Actions).
3. Bump `package.json` version, commit, and push.
4. Create a GitHub Release (for example `v1.0.1`).

The workflow runs tests first and then publishes with provenance enabled.

If publishing fails with permissions, verify org membership and package access:

```bash
npm org ls supejs
npm access ls-packages <your-npm-username>
npm token list
```

## Development

Run automated tests:

```bash
npm test
python3 -m unittest discover -s tests -v
```

## Governance

- [LICENSE](LICENSE)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
