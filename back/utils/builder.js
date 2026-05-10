/**
 * utils/builder.js — Shell command helpers
 *
 * cloneRepo  — git clone a GitHub URL into a local directory
 * buildReact — npm install + vite build with correct base path
 * copyDir    — recursively copy a folder to the sites directory
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Clone a public GitHub repo into destDir.
 * Throws if git is not installed or the URL is invalid.
 */
const cloneRepo = (repoUrl, destDir) => {
  // Basic URL validation — must look like a github.com URL
  if (!repoUrl.startsWith("https://github.com/")) {
    throw new Error("Only public GitHub URLs are supported (https://github.com/...)");
  }

  execSync(`git clone --depth=1 ${repoUrl} ${destDir}`, {
    stdio: "pipe", // suppress output, errors still thrown
    timeout: 60000, // 60s max clone time
  });
};

/**
 * Run npm install and vite build inside cloneDir.
 * Passes --base=/siteId/ so all asset paths are correct
 * when served under http://IP/siteId/
 */
const buildReact = (cloneDir, siteId) => {
  const opts = {
    cwd: cloneDir,
    stdio: "pipe",
    timeout: 120000, // 2 min max build time
  };

  // Install dependencies
  execSync("npm install", opts);

  // Build with the correct base path baked in
  execSync(`npx vite build --base=/${siteId}/`, opts);
};

/**
 * Recursively copy all files from src to dest.
 * Pure Node — no shell cp -r needed.
 */
const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath); // recurse
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

module.exports = { cloneRepo, buildReact, copyDir };
