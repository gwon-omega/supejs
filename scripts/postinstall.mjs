#!/usr/bin/env node
/**
 * Cross-platform postinstall: mark bin/ files executable on Unix/macOS.
 * On Windows, chmod is a no-op; npm does not require executable bits there.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.platform !== "win32") {
  const binDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "bin",
  );
  try {
    for (const file of fs.readdirSync(binDir)) {
      const full = path.join(binDir, file);
      const stat = fs.statSync(full);
      // Add execute bits for owner/group/other
      fs.chmodSync(full, stat.mode | 0o111);
    }
  } catch {
    // Non-fatal: installation should not fail if chmod is unavailable
  }
}
