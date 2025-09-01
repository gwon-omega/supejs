<<<<<<< HEAD

<div align="center">

# Supe.js ⚡

**Supe.js is a production-oriented CLI for project scaffolding, policy checks, design guidance, and developer workflow planning.**

![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![Module Type](https://img.shields.io/badge/modules-ESM-1f6feb)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

## Why this project

supe.js helps teams bootstrap modern app stacks with sensible defaults while keeping security and compatibility in check. It combines:

## Highlights

## Installation

```bash
npm install
```

Run directly:

```bash
node bin/supe.js --help
```

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

```bash
npm whoami
npm test
npm pack
npm publish --dry-run --access public
```

## Development

Run automated tests:

```bash
npm test
python3 -m unittest discover -s tests -v
```

## Governance

=======

# 🚀 Create Super App

> **The ultimate web scaffolding CLI** - Generate production-ready apps with your favorite framework, UI library, and features in seconds.

[![npm version](https://badge.fury.io/js/create-super-app.svg)](https://www.npmjs.com/package/create-super-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Contributors](https://img.shields.io/github/contributors/your-username/create-super-app.svg)](https://github.com/your-username/create-super-app/graphs/contributors)

## ✨ What Makes This Special?

**Create Super App** is a modern, opinionated CLI that scaffolds full-stack web applications with **zero configuration**. Choose your stack and get a production-ready codebase instantly.

### 🎯 Key Features

## 🚀 Quick Start

```bash
# Interactive mode (recommended for beginners)
npx create-super-app my-awesome-app

# Express mode with flags
npx create-super-app my-dashboard \
  --framework nextjs \
  --ui shadcn \
  --template admin-dashboard \
  --addons auth,prisma,testing \
  --pm pnpm
```

### 🎬 Demo

```bash
# Create a modern e-commerce store
npx create-super-app my-store --framework nextjs --ui tailwind-headless --template ecommerce --addons stripe,auth

# Build an admin dashboard
npx create-super-app admin-panel --framework nextjs --ui shadcn --template admin-dashboard --addons auth,prisma

# Start a blog with Astro
npx create-super-app my-blog --framework astro --ui tailwind-headless --template blog --addons i18n
```

## 📚 Complete Options Guide

### 🏗️ **Frameworks**

| Framework | Description                          | Best For                                 |
| --------- | ------------------------------------ | ---------------------------------------- |
| `nextjs`  | React with App Router, SSR/SSG       | Full-stack apps, e-commerce, dashboards  |
| `nuxt`    | Vue 3 with SSR/SSG                   | Vue developers, content sites            |
| `astro`   | Multi-framework, island architecture | Blogs, documentation, marketing sites    |
| `remix`   | React with focus on web standards    | Data-heavy apps, progressive enhancement |

### 🎨 **UI Libraries**

| Library             | Description                   | Framework Support |
| ------------------- | ----------------------------- | ----------------- |
| `shadcn`            | Radix + Tailwind components   | Next.js, Remix    |
| `tailwind-headless` | Pure Tailwind utility classes | All frameworks    |
| `nextui`            | Modern React components       | Next.js, Remix    |
| `chakra`            | Modular and accessible        | Next.js, Remix    |
| `material`          | Google's Material Design      | Next.js, Remix    |
| `antd`              | Enterprise-class UI language  | Next.js, Remix    |
| `radix`             | Low-level UI primitives       | Next.js, Remix    |

### 📦 **Templates**

| Template          | Description                   | Includes                        |
| ----------------- | ----------------------------- | ------------------------------- |
| `admin-dashboard` | Feature-rich admin panel      | Charts, tables, user management |
| `ecommerce`       | Complete online store         | Product catalog, cart, checkout |
| `portfolio`       | Personal/agency showcase      | Projects, about, contact forms  |
| `blog`            | Content-focused site          | Posts, categories, SEO          |
| `saas`            | SaaS landing page             | Pricing, features, testimonials |
| `mis`             | Management information system | Data tables, reports, workflows |

### ⚡ **Add-ons**

| Add-on      | Description                | What's Included                                            |
| ----------- | -------------------------- | ---------------------------------------------------------- |
| `auth`      | NextAuth.js authentication | Login/signup pages, providers (Google, GitHub), middleware |
| `prisma`    | Prisma ORM with SQLite     | Schema, client, migrations, seed scripts                   |
| `drizzle`   | Drizzle ORM setup          | Type-safe SQL, migrations                                  |
| `stripe`    | Payment integration        | Checkout API routes, webhooks                              |
| `i18n`      | Internationalization       | Multi-language support, translations                       |
| `testing`   | Testing setup              | Vitest, Playwright, test examples                          |
| `ci`        | GitHub Actions workflow    | Automated testing, building, deployment                    |
| `docker`    | Containerization           | Multi-stage Dockerfile, docker-compose                     |
| `pwa`       | Progressive Web App        | Service worker, manifest, offline support                  |
| `sentry`    | Error monitoring           | Performance tracking, error reporting                      |
| `storybook` | Component documentation    | Interactive component explorer                             |

## 📖 Usage Examples

### 🎯 **Common Use Cases**

<details>
<summary><b>🏢 Enterprise Dashboard</b></summary>

```bash
npx create-super-app enterprise-dashboard \
  --framework nextjs \
  --ui antd \
  --template admin-dashboard \
  --addons auth,prisma,testing,ci,sentry \
  --pm pnpm
```

**What you get:**

</details>

<details>
<summary><b>🛒 Modern E-commerce</b></summary>

```bash
npx create-super-app online-store \
  --framework nextjs \
  --ui shadcn \
  --template ecommerce \
  --addons auth,prisma,stripe,pwa \
  --pm pnpm
```

**What you get:**

</details>

<details>
<summary><b>📝 Content Blog</b></summary>

```bash
npx create-super-app my-blog \
  --framework astro \
  --ui tailwind-headless \
  --template blog \
  --addons i18n,testing \
  --pm pnpm
```

**What you get:**

</details>

### 🔧 **Development Workflow**

After scaffolding your project:

```bash
cd my-awesome-app

# Install dependencies (if you used --no-install)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Initialize database (if using Prisma)
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## 🏗️ Project Structure

Every generated project follows a consistent, scalable structure:

```
my-awesome-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/                # UI library components
│   └── custom/            # Custom components
├── lib/                   # Utilities and configurations
│   ├── auth.ts            # Authentication config
│   ├── db.ts              # Database client
│   └── utils.ts           # Helper functions
├── styles/                # Global styles
├── prisma/                # Database schema (if using Prisma)
├── tests/                 # Test files
├── .github/workflows/     # CI/CD workflows
└── package.json           # Dependencies and scripts
```

## 🤝 Contributing

We love contributions! This project is **open source** and welcoming to developers of all skill levels.

### 🌟 **Ways to Contribute**

### 🛠️ **Development Setup**

```bash
# Fork and clone the repository
git clone https://github.com/your-username/create-super-app.git
cd create-super-app

# Install dependencies
pnpm install

# Test the CLI locally
node bin/index.js test-app --help

# Run tests
pnpm test

# Test your changes
node bin/index.js my-test-app --framework nextjs --ui shadcn
```

### 📁 **Adding New Content**

<details>
<summary><b>🎨 Adding a New UI Library</b></summary>

1. Create component files in `ui-components/your-library/`
2. Add peer dependencies to `lib/ui.js`
3. Update the choices in `lib/prompts.js`
4. Test with a sample project

```bash
# Example structure
ui-components/
└── your-library/
    ├── button.tsx
    ├── card.tsx
    └── index.ts
```

</details>

<details>
<summary><b>📦 Adding a New Template</b></summary>

1. Create template files in `templates/framework/your-template/`
2. Include a `package.json` with additional dependencies
3. Add the template to `lib/prompts.js`
4. Test across different frameworks

```bash
# Example structure
templates/
└── next/
    └── your-template/
        ├── app/
        ├── components/
        ├── package.json
        └── README.md
```

</details>

<details>
<summary><b>⚡ Adding a New Add-on</b></summary>

1. Create addon files in `addon-snippets/your-addon/`
2. Support framework-specific variations
3. Include setup instructions in README
4. Add peer dependencies in `package.json`

```bash
# Example structure
addon-snippets/
└── your-addon/
    ├── nextjs/          # Framework-specific files
    ├── package.json     # Dependencies
    └── README.md        # Setup instructions
```

</details>

### 📋 **Contribution Guidelines**

1. **Follow the existing code style** (we use Prettier)
2. **Test your changes** across different combinations
3. **Update documentation** when adding features
4. **Write descriptive commit messages**
5. **Create focused pull requests** (one feature/fix per PR)

## 🎯 Roadmap

### 🚧 **In Progress**

### 💭 **Planned Features**

### 🔮 **Future Ideas**

## 📊 **Stats & Community**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🤲 **Open Source Philosophy**

We believe in:

## 🙏 Acknowledgments

Special thanks to:

## 📞 Get Help & Connect

<div align="center">

**⭐ Star this repository if it helps you build amazing web apps! ⭐**

[Report Bug](https://github.com/your-username/create-super-app/issues) • [Request Feature](https://github.com/your-username/create-super-app/issues) • [Contribute](https://github.com/your-username/create-super-app/pulls)

Made with ❤️ by the Create Super App community

</div>
>>>>>>> dc251fa (initial commit)
