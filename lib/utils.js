import path from "node:path";
import fs from "fs-extra";
import { run } from "./run.js";

export async function ensureGitInit(projectPath) {
  const gitDir = path.join(projectPath, ".git");
  const exists = await fs.pathExists(gitDir);
  if (!exists) {
    await run("git", ["init"], { cwd: projectPath, title: "git init" });
    await run("git", ["add", "-A"], { cwd: projectPath, title: "git add" });
    await run("git", ["commit", "-m", "chore: scaffold project"], {
      cwd: projectPath,
      title: "git commit",
    });
  }
}
