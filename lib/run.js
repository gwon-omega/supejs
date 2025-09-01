import { execa } from "execa";
import ora from "ora";

export async function run(cmd, args, opts = {}) {
  const spinner = ora(opts.title || `${cmd} ${args.join(" ")}`).start();
  try {
    await execa(cmd, args, { stdio: "inherit", ...opts });
    spinner.succeed();
  } catch (e) {
    spinner.fail();
    throw e;
  }
}

export function pmExec(pm, script) {
  const map = {
    npm: ["npm", ["run", script]],
    pnpm: ["pnpm", [script]],
    yarn: ["yarn", [script]],
    bun: ["bun", [script]],
  };
  return map[pm];
}

export function pmInstall(pm) {
  const map = {
    npm: ["npm", ["install"]],
    pnpm: ["pnpm", ["install"]],
    yarn: ["yarn", []],
    bun: ["bun", ["install"]],
  };
  return map[pm];
}
