import path from "node:path";
import fs from "fs-extra";

export async function applyTemplate({ framework, template, projectPath }) {
  if (!template) return;

  const sourceBase = path.join(process.cwd(), "templates");
  const baseDir = path.join(
    sourceBase,
    framework === "nextjs" ? "next" : framework,
    "base"
  );

  // Always lay down base first when available
  if (await fs.pathExists(baseDir)) {
    await fs.copy(baseDir, projectPath, {
      overwrite: true,
      filter: noNodeModules,
    });
  }

  // Concrete templates live under framework dir by slug
  const templateDir = path.join(
    sourceBase,
    framework === "nextjs" ? "next" : framework,
    template
  );
  if (await fs.pathExists(templateDir)) {
    await fs.copy(templateDir, projectPath, {
      overwrite: true,
      filter: noNodeModules,
    });
  }

  // Merge package.json if a template provides one
  const tplPkgPath = path.join(templateDir, "package.json");
  if (await fs.pathExists(tplPkgPath)) {
    const targetPkgPath = path.join(projectPath, "package.json");
    const [src, dst] = await Promise.all([
      fs.readJson(tplPkgPath),
      fs.readJson(targetPkgPath),
    ]);
    const merged = mergePackageJson(dst, src);
    await fs.writeJson(targetPkgPath, merged, { spaces: 2 });
  }
}

function noNodeModules(src) {
  return !src.includes("node_modules");
}

function mergePackageJson(base, extra) {
  const merged = { ...base };
  // shallow fields
  for (const key of ["type", "module", "sideEffects"]) {
    if (extra[key] !== undefined) merged[key] = extra[key];
  }
  // deep merge simple maps
  for (const key of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "scripts",
  ]) {
    merged[key] = { ...(base[key] || {}), ...(extra[key] || {}) };
  }
  return merged;
}
