const express = require("express");
const router = express.Router();
const Division = require("../models/division.model");
const { authMiddleware } = require("../middleware/auth");

// Return all divisions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (err) {
    res.status(500).json({ message: "Error loading divisions." });
  }
});

module.exports = router;
