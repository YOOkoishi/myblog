import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const siteDirectory = "dist";
const indexDirectory = path.join(siteDirectory, "pagefind");
const deploymentDirectory = ".vercel/output/static";
const deploymentIndex = path.join(deploymentDirectory, "pagefind");

try {
  if (!statSync(siteDirectory).isDirectory()) {
    throw new Error("Build the site before generating the search index.");
  }

  // Pagefind uses hashed fragments: replace old bundles instead of merging them.
  rmSync(indexDirectory, { recursive: true, force: true });
  const hasDeployment = existsSync(deploymentDirectory);
  if (hasDeployment) {
    rmSync(deploymentIndex, { recursive: true, force: true });
  }

  const result = spawnSync("pagefind", ["--site", siteDirectory], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  if (!statSync(path.join(indexDirectory, "pagefind.js")).isFile()) {
    throw new Error("Pagefind did not generate its search bundle.");
  }

  // The Vercel adapter copies the site before Pagefind runs.
  if (hasDeployment) {
    cpSync(indexDirectory, deploymentIndex, { recursive: true });
    console.log("Search index synced to .vercel/output/static/pagefind.");
  }
} catch (error) {
  console.error("Search index build failed:", error.message);
  process.exitCode = 1;
}
