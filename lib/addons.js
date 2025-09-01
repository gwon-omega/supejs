import path from "node:path";
import fs from "fs-extra";

export async function applyAddons({ addons = [], framework, projectPath }) {
  if (!addons || addons.length === 0) return;

  const root = path.join(process.cwd(), "addon-snippets");

  for (const addon of addons) {
    const addonDir = path.join(root, addon);
    if (!(await fs.pathExists(addonDir))) continue;

    // framework-aware subdir support
    const frameworkDir = path.join(
      addonDir,
      framework === "nextjs" ? "nextjs" : framework
    );
    if (await fs.pathExists(frameworkDir)) {
      await fs.copy(frameworkDir, projectPath, { overwrite: true });
    }

    // common files at addon root
    const commonFiles = (await fs.readdir(addonDir)).filter(
      (name) =>
        name !== "nextjs" &&
        name !== "nuxt" &&
        name !== "astro" &&
        name !== "remix"
    );
    for (const name of commonFiles) {
      const src = path.join(addonDir, name);
      const dst = path.join(projectPath, name);
      const stat = await fs.stat(src);
      if (stat.isDirectory()) {
        await fs.copy(src, dst, { overwrite: true });
      } else {
        await fs.copyFile(src, dst);
      }
    }
  }
}
