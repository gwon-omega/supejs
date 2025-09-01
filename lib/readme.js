import path from "node:path";
import fs from "fs-extra";
import Mustache from "mustache";

const template = `# {{projectName}}

Scaffolded with create-super-app.

## Tech
- Framework: **{{framework}}**
- UI: **{{ui}}**
- Template: **{{template}}**
- Add-ons: **{{addons}}**

## Getting started
\`\`\`
{{pm}} install
{{#isAngular}}
{{pm}} start
{{/isAngular}}
{{^isAngular}}
{{pm}} run dev
{{/isAngular}}
\`\`\`
`;

export async function genReadme({
  projectPath,
  projectName,
  framework,
  ui,
  template: tpl,
  addons = [],
  pm,
}) {
  const readmePath = path.join(projectPath, "README.md");
  const body = Mustache.render(template, {
    projectName,
    framework,
    ui,
    template: tpl,
    addons: addons.length ? addons.join(", ") : "none",
    pm,
    isAngular: framework === "angular",
  });
  await fs.writeFile(readmePath, body, "utf8");
}
