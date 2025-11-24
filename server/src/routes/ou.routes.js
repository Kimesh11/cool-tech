const express = require("express");
const router = express.Router();
const OrganisationalUnit = require("../models/ou.model");
const { authMiddleware } = require("../middleware/auth");

// Return all OUs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const ous = await OrganisationalUnit.find();
    res.json(ous);
  } catch (err) {
    res.status(500).json({ message: "Error loading organisational units." });
  }
});

module.exports = router;
