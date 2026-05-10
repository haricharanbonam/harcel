/**
 * routes/deploy.js — Deploy endpoints
 *
 * POST /deploy/file   — upload a single HTML file
 * POST /deploy/github — clone a GitHub repo and deploy
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { deployFile, deployGithub } = require("../controllers/deployController");

// multer stores the raw upload in /tmp before controller moves it
const upload = multer({ dest: "/tmp/uploads/" });

router.post("/file", upload.single("site"), deployFile);
router.post("/github", deployGithub);

module.exports = router;
