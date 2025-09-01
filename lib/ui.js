import path from "node:path";
import fs from "fs-extra";
import { run, pmInstall } from "./run.js";

export async function installUi({ ui, projectPath, pm, skipInstall }) {
  if (!ui) return;

  const presetsRoot = path.join(process.cwd(), "ui-components");

  // Copy preset shims into project under components/ui if present
  const src = path.join(presetsRoot, ui);
  const dst = path.join(projectPath, "components", "ui");
  if (await fs.pathExists(src)) {
    await fs.ensureDir(dst);
    await fs.copy(src, dst, { overwrite: true });
  }

  // Install peer deps for some UIs
  if (!skipInstall) {
    const deps = uiPeerDeps(ui);
    if (deps.length) {
      const [bin, args] = pmInstall(pm);
      await run(bin, [...args, ...deps], {
        cwd: projectPath,
        title: `${pm} install ${deps.join(" ")}`,
      });
    }
  }
}

function uiPeerDeps(ui) {
  switch (ui) {
    case "shadcn":
      return ["clsx", "tailwindcss", "class-variance-authority"];
    case "nextui":
      return ["@nextui-org/react"];
    case "material":
      return ["@mui/material", "@emotion/react", "@emotion/styled"];
    case "chakra":
      return [
        "@chakra-ui/react",
        "@emotion/react",
        "@emotion/styled",
        "framer-motion",
      ];
    default:
      return [];
  }
}
