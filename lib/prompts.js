import inquirer from "inquirer";

export const FRAMEWORKS = [
  { name: "Next.js", value: "nextjs" },
  { name: "Nuxt", value: "nuxt" },
  { name: "Astro", value: "astro" },
  { name: "Remix", value: "remix" },
];

export const UI_LIBS = [
  { name: "shadcn/ui (Next.js)", value: "shadcn" },
  { name: "Tailwind Headless", value: "tailwind-headless" },
  { name: "NextUI", value: "nextui" },
  { name: "Material UI", value: "material" },
  { name: "Chakra UI", value: "chakra" },
];

export const TEMPLATES = [
  { name: "Admin dashboard", value: "admin-dashboard" },
  { name: "E-commerce", value: "ecommerce" },
  { name: "MIS", value: "mis" },
  { name: "Portfolio", value: "portfolio" },
  { name: "Blog", value: "blog" },
  { name: "SaaS Landing", value: "saas" },
];

export const ADDONS = [
  { name: "Authentication (Auth.js preset)", value: "auth" },
  { name: "Prisma (SQLite default)", value: "prisma" },
  { name: "Drizzle ORM", value: "drizzle" },
  { name: "Stripe payments (sample route)", value: "stripe" },
  { name: "i18n (next-intl / i18next)", value: "i18n" },
  { name: "Testing (Vitest + Playwright)", value: "testing" },
  { name: "CI (GitHub Actions Node CI)", value: "ci" },
  { name: "Docker (Node + multi-stage)", value: "docker" },
  { name: "PWA (where supported)", value: "pwa" },
  { name: "Sentry (perf + errors)", value: "sentry" },
  { name: "Storybook", value: "storybook" },
];

export function normalizeFlags(projectName, opts) {
  const addons =
    typeof opts.addons === "string" && opts.addons.length
      ? opts.addons.split(",").map((s) => s.trim())
      : undefined;
  return {
    projectName,
    framework: opts.framework,
    ui: opts.ui,
    template: opts.template,
    addons,
    pm: opts.pm,
    yes: !!opts.yes,
  };
}

export async function askQuestions(flags) {
  const answers = { ...flags };
  const questions = [];

  if (!answers.framework) {
    questions.push({
      type: "list",
      name: "framework",
      message: "Framework?",
      choices: FRAMEWORKS,
    });
  }
  if (!answers.ui) {
    questions.push({
      type: "list",
      name: "ui",
      message: "UI library?",
      choices: UI_LIBS,
    });
  }
  if (!answers.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Template?",
      choices: TEMPLATES,
    });
  }
  if (!answers.addons) {
    questions.push({
      type: "checkbox",
      name: "addons",
      message: "Add-ons?",
      choices: ADDONS,
    });
  }
  if (!answers.pm) {
    questions.push({
      type: "list",
      name: "pm",
      message: "Package manager?",
      choices: [
        { name: "pnpm", value: "pnpm" },
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "bun", value: "bun" },
      ],
    });
  }

  if (questions.length) {
    const out = await inquirer.prompt(questions);
    Object.assign(answers, out);
  }

  return answers;
}
