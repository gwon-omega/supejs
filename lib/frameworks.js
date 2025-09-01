import path from "node:path";
import fs from "fs-extra";
import { run } from "./run.js";

export async function createProject({ framework, projectName, pm }) {
  const cwd = process.cwd();
  const projectPath = path.join(cwd, projectName);

  await fs.ensureDir(projectPath);

  switch (framework) {
    case "nextjs":
      await run(
        "npx",
        [
          "--yes",
          "create-next-app@latest",
          projectName,
          "--ts",
          "--eslint",
          "--app",
        ],
        { cwd }
      );
      break;
    case "nuxt":
      await run("npx", ["--yes", "nuxi@latest", "init", projectName], { cwd });
      break;
    case "astro":
      await run(
        "npm",
        [
          "create",
          "astro@latest",
          projectName,
          "--",
          "--template",
          "basics",
          "--no",
          "--yes",
        ],
        { cwd }
      );
      break;
    case "remix":
      await run(
        "npx",
        [
          "--yes",
          "create-remix@latest",
          projectName,
          "--template",
          "remix-run/remix/templates/ts",
        ],
        { cwd }
      );
      break;
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }

  return projectPath;
}
