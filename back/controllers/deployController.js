/**
 * controllers/deployController.js — Core deployment logic
 *
 * Handles two deployment strategies:
 *   1. File upload  → save index.html directly to sites dir
 *   2. GitHub URL   → clone repo, optionally build, copy output
 */

const fs = require("fs");
const path = require("path");
const { generateId } = require("../utils/generateId");
const { cloneRepo, buildReact, copyDir } = require("../utils/builder");

// Where all deployed sites live — must match nginx root
const SITES_DIR = process.env.SITES_DIR || "/var/www/sites";

// Public base URL of the EC2 — set in .env
const BASE_URL = process.env.BASE_URL || "http://localhost";

/**
 * POST /deploy/file
 * Accepts a single .html file upload and serves it at /<siteId>/
 */
const deployFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const siteId = generateId();
    const siteDir = path.join(SITES_DIR, siteId);

    // Create site directory
    fs.mkdirSync(siteDir, { recursive: true });

    // Move uploaded file → index.html
  fs.copyFileSync(req.file.path, path.join(siteDir, "index.html"));
fs.unlinkSync(req.file.path); 

    return res.json({
      success: true,
      siteId,
      url: `${BASE_URL}/${siteId}/`,
    });
  } catch (err) {
    console.error("[deployFile]", err);
    return res.status(500).json({ error: "Deployment failed", detail: err.message });
  }
};

/**
 * POST /deploy/github
 * Body: { repoUrl: string, type: "html" | "react" }
 *
 * html  → clones repo, copies all files as-is
 * react → clones repo, runs `npm install && vite build --base=/siteId/`
 *         then copies the dist/ folder
 */
const deployGithub = async (req, res) => {
  const { repoUrl, type } = req.body;

  if (!repoUrl || !type) {
    return res.status(400).json({ error: "repoUrl and type are required" });
  }

  if (!["html", "react"].includes(type)) {
    return res.status(400).json({ error: "type must be html or react" });
  }

  const siteId = generateId();
  const cloneDir = `/tmp/clone-${siteId}`;
  const siteDir = path.join(SITES_DIR, siteId);

  try {
    // Step 1 — clone the repo into a temp folder
    console.log(`[${siteId}] Cloning ${repoUrl}...`);
    cloneRepo(repoUrl, cloneDir);

    // Step 2 — build if React, else just copy
    if (type === "react") {
      console.log(`[${siteId}] Building React app with base /${siteId}/...`);
      buildReact(cloneDir, siteId);

      // Vite outputs to cloneDir/dist
      const distDir = path.join(cloneDir, "dist");
      if (!fs.existsSync(distDir)) {
        throw new Error("Build succeeded but dist/ folder not found");
      }

      fs.mkdirSync(siteDir, { recursive: true });
      copyDir(distDir, siteDir);
    } else {
      // HTML — copy everything as-is
      fs.mkdirSync(siteDir, { recursive: true });
      copyDir(cloneDir, siteDir);
    }

    // Step 3 — cleanup temp clone
    fs.rmSync(cloneDir, { recursive: true, force: true });

    console.log(`[${siteId}] Deployed at ${BASE_URL}/${siteId}/`);

    return res.json({
      success: true,
      siteId,
      url: `${BASE_URL}/${siteId}/`,
    });
  } catch (err) {
    console.error("[deployGithub]", err);
    return res.status(500).json({ error: "GitHub deployment failed", detail: err.message });
  }
};

module.exports = { deployFile, deployGithub };
