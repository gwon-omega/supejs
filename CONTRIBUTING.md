<<<<<<< HEAD

# Contributing to Super App

Thanks for contributing!

## Workflow

1. Fork and create a feature branch.
2. Keep changes focused and backward-compatible.
3. Add or update tests for every behavior change.
4. Update README when CLI behavior changes.

## Required checks

## Pull requests

=======

# 🤝 Contributing to Create Super App

First off, **thank you** for considering contributing to Create Super App! 🎉

This project exists because of amazing people like you. Whether you're fixing a bug, adding a feature, or improving documentation, every contribution makes a difference.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding New Content](#adding-new-content)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [info@mukeshnath.com.np](mailto:info@mukeshnath.com.np).

## 🌟 How Can I Contribute?

### 🐛 **Reporting Bugs**

Before creating bug reports, check the [existing issues](https://github.com/your-username/create-super-app/issues) to avoid duplicates.

**How to submit a good bug report:**

1. **Use a clear, descriptive title**
2. **Describe the exact steps to reproduce**
3. **Provide specific examples** (commands, code snippets)
4. **Describe the behavior you observed** vs. what you expected
5. **Include environment details** (OS, Node version, package manager)

**Bug Report Template:**

```markdown
## Bug Description

A clear description of what the bug is.

## Steps to Reproduce

1. Run `npx create-super-app my-app --framework nextjs --ui shadcn`
2. Navigate to the generated project
3. Run `npm run dev`
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g., Windows 11, macOS 13.0, Ubuntu 20.04]
- Node Version: [e.g., 18.17.0]
- Package Manager: [e.g., npm 9.6.7, pnpm 8.6.12]
- CLI Version: [e.g., 0.1.0]

## Additional Context

Screenshots, logs, or other relevant information.
```

### 💡 **Suggesting Enhancements**

Enhancement suggestions are welcome! Please provide:

1. **Clear use case** - Why would this be useful?
2. **Detailed description** - How should it work?
3. **Examples** - Show what the API/CLI would look like
4. **Alternative solutions** - What other approaches did you consider?

### 🔍 **Good First Issues**

Look for issues labeled [`good first issue`](https://github.com/your-username/create-super-app/labels/good%20first%20issue) - these are perfect for newcomers!

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** (recommended) or npm
- **Git**

### Setup Steps

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/create-super-app.git
cd create-super-app

# 3. Install dependencies
pnpm install

# 4. Test the CLI locally
node bin/index.js --help

# 5. Create a test project
node bin/index.js test-project --framework nextjs --ui shadcn --template admin-dashboard

# 6. Verify the generated project works
cd test-project
pnpm install
pnpm dev
```

### 🧪 **Testing Your Changes**

```bash
# Test different combinations
node bin/index.js test-nextjs --framework nextjs --ui shadcn
node bin/index.js test-nuxt --framework nuxt --ui tailwind-headless
node bin/index.js test-astro --framework astro --ui tailwind-headless

# Run all tests
pnpm test

# Check code formatting
pnpm lint
```

---

## 📁 Project Structure

Understanding the codebase structure will help you contribute effectively:

```
create-super-app/
├── bin/
│   └── index.js              # Main CLI entry point
├── lib/                      # Core library modules
│   ├── prompts.js           # Interactive prompts & choices
│   ├── frameworks.js        # Framework-specific logic
│   ├── templates.js         # Template application
│   ├── ui.js                # UI library installation
│   ├── addons.js            # Addon integration
│   ├── readme.js            # README generation
│   ├── run.js               # Shell command utilities
│   └── utils.js             # General utilities
├── templates/               # Project templates
│   ├── next/                # Next.js templates
│   ├── nuxt/                # Nuxt templates
│   ├── astro/               # Astro templates
│   └── remix/               # Remix templates
├── ui-components/           # UI library presets
│   ├── shadcn/              # shadcn/ui components
│   ├── tailwind-headless/   # Tailwind components
│   ├── nextui/              # NextUI components
│   └── ...                  # Other UI libraries
├── addon-snippets/          # Feature add-ons
│   ├── auth/                # Authentication setup
│   ├── prisma/              # Database with Prisma
│   ├── stripe/              # Payment integration
│   └── ...                  # Other addons
└── tests/                   # Test files
```

---

## 🚀 Adding New Content

### 🎨 **Adding a New UI Library**

1. **Create the component files:**

```bash
mkdir ui-components/your-library
cd ui-components/your-library

# Create basic components
touch button.tsx card.tsx input.tsx
```

2. **Implement consistent component APIs:**

```typescript
// button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  // Your implementation using the target UI library
};
```

3. \*_Add to prompts.js:_

```javascript
export const UI_LIBS = [
  // ... existing libraries
  { name: "Your Library", value: "your-library" },
];
```

4. **Add peer dependencies in ui.js:**

```javascript
function uiPeerDeps(ui) {
  switch (ui) {
    // ... existing cases
    case "your-library":
      return ["your-library-package", "peer-dependency"];
    default:
      return [];
  }
}
```

### 📦 **Adding a New Template**

1. **Create template structure:**

```bash
mkdir -p templates/next/your-template
cd templates/next/your-template

# Create the template files
mkdir -p app components lib styles
touch app/layout.tsx app/page.tsx package.json
```

2. **Implement the template:**

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Your Template</h1>
      <p>Template-specific content here</p>
    </div>
  );
}
```

3. **Add dependencies in package.json:**

```json
{
  "dependencies": {
    "template-specific-package": "^1.0.0"
  },
  "devDependencies": {
    "dev-dependency": "^2.0.0"
  }
}
```

4. **Add to prompts.js:**

```javascript
export const TEMPLATES = [
  // ... existing templates
  { name: "Your Template Description", value: "your-template" },
];
```

### ⚡ **Adding a New Add-on**

1. **Create addon structure:**

```bash
mkdir -p addon-snippets/your-addon
cd addon-snippets/your-addon

# Framework-specific files
mkdir nextjs nuxt astro remix

# Common files
touch package.json README.md .env.example
```

2. **Add framework-specific implementations:**

```bash
# For Next.js
mkdir -p nextjs/app/api/your-feature
touch nextjs/app/api/your-feature/route.ts

# For other frameworks
touch nuxt/plugins/your-feature.ts
touch astro/src/utils/your-feature.ts
```

3. **Document usage:**

```markdown
# addon-snippets/your-addon/README.md

# Your Addon

Brief description of what this addon provides.

## Setup

1. Install dependencies: `npm install package-name`
2. Set environment variables in `.env.local`
3. Configure your settings in `lib/your-addon.ts`

## Usage

[Provide usage examples]
```

4. **Add to prompts.js:**

```javascript
export const ADDONS = [
  // ... existing addons
  { name: "Your Addon (description)", value: "your-addon" },
];
```

### 🏗️ **Adding a New Framework**

1. **Add framework support in frameworks.js:**

```javascript
case 'your-framework':
  await run('npx', ['create-your-framework@latest', projectName], { cwd });
  break;
```

2. **Create base template:**

```bash
mkdir -p templates/your-framework/base
# Add framework-specific base files
```

3. **Update all relevant addons** to support the new framework

4. **Add to prompts.js:**

```javascript
export const FRAMEWORKS = [
  // ... existing frameworks
  { name: "Your Framework", value: "your-framework" },
];
```

---

## 🧪 Testing Guidelines

### **Manual Testing Checklist**

Before submitting a PR, test these combinations:

**Framework + UI combinations:**

- [ ] Next.js + shadcn
- [ ] Next.js + tailwind-headless
- [ ] Nuxt + tailwind-headless
- [ ] Astro + tailwind-headless

**Template functionality:**

- [ ] Base template generates correctly
- [ ] Admin dashboard includes all components
- [ ] E-commerce template has working layout

**Add-on integration:**

- [ ] Auth addon creates working authentication
- [ ] Prisma addon sets up database correctly
- [ ] Multiple addons work together

**Cross-platform testing:**

- [ ] Windows
- [ ] macOS
- [ ] Linux (Ubuntu/Debian)

### **Automated Testing**

```bash
# Run existing tests
pnpm test

# Test specific scenarios
pnpm test:cli
pnpm test:templates
pnpm test:integration
```

---

## 📝 Pull Request Process

### **Before You Submit**

1. **Test thoroughly** - Follow the testing checklist
2. **Update documentation** - README, comments, JSDoc
3. **Follow code style** - Run `pnpm lint` and `pnpm format`
4. **Write descriptive commits** - Use conventional commit format

### **PR Title Format**

```
type(scope): description

Examples:
feat(ui): add Mantine UI library support
fix(templates): resolve Next.js admin dashboard routing
docs(readme): update installation instructions
```

### **PR Description Template**

```markdown
## What does this PR do?

Brief description of the changes.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing

- [ ] I have tested these changes locally
- [ ] I have tested on multiple OS platforms
- [ ] I have updated/added tests as needed

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### **Review Process**

1. **Automated checks** must pass (linting, tests)
2. **Manual review** by maintainers
3. **Testing** on different platforms if needed
4. **Approval** and merge

---

## 🎨 Style Guidelines

### **Code Style**

- **Language**: TypeScript for type safety
- **Formatting**: Prettier (run `pnpm format`)
- **Linting**: ESLint (run `pnpm lint`)
- **File naming**: kebab-case for files, PascalCase for components

### **Commit Messages**

We use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat(ui): add NextUI component library
fix(templates): resolve admin dashboard layout issue
docs(contributing): add testing guidelines
```

### **Documentation Style**

- **Clear headings** with emojis for visual appeal
- **Code examples** for every feature
- **Step-by-step instructions** for complex processes
- **Screenshots/GIFs** when helpful

---

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### **High Priority**

- 🐛 **Bug fixes** - Especially cross-platform issues
- 📚 **Documentation improvements** - Examples, guides, API docs
- 🧪 **Test coverage** - Unit tests, integration tests
- ♿ **Accessibility** - Making generated apps more accessible

### **Medium Priority**

- 🎨 **New UI libraries** - Popular component libraries
- 📦 **New templates** - Real-world application templates
- ⚡ **New addons** - Developer productivity tools
- 🏗️ **Framework support** - SvelteKit, Angular, etc.

### **Nice to Have**

- 🎬 **Demo projects** - Showcase generated applications
- 📊 **Analytics** - Usage tracking and metrics
- 🔧 **Tooling improvements** - Better DX, automation
- 🌍 **Internationalization** - Multi-language CLI support

---

## ❓ Questions?

- 💬 **GitHub Discussions** - General questions and ideas
- 🐛 **GitHub Issues** - Bugs and specific problems
- 📧 **Email** - [contribute@createsuperapp.dev](mailto:contribute@createsuperapp.dev)
- 🐦 **Twitter** - [@createsuperapp](https://twitter.com/createsuperapp)

---

## 🙏 Recognition

Contributors are recognized in:

- 📋 **Contributors list** in README.md
- 🏆 **Release notes** for significant contributions
- 💝 **Special thanks** section for ongoing contributors
- 🌟 **Contributor spotlight** on social media

---

**Thank you for contributing to Create Super App! 🚀**

Together, we're making web development more accessible and enjoyable for everyone.

> > > > > > > dc251fa (initial commit)
