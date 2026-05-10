/**
 * utils/generateId.js
 * Generates a short random alphanumeric ID for each deployment.
 * Example output: "a3f9bc12"
 */

const crypto = require("crypto");

const generateId = () => crypto.randomBytes(4).toString("hex");

module.exports = { generateId };
