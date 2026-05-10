/**
 * server.js — Entry point
 * Boots Express, mounts middleware and routes.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const deployRoutes = require("./routes/deploy");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/deploy", deployRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Platform backend running on port ${PORT}`);
});
