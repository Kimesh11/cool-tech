const express = require("express");
const router = express.Router();

const Credential = require("../models/credentialRepository.model");
const { authMiddleware } = require("../middleware/auth");

// GET - Returns all credentials for a division.
router.get("/:divisionId", authMiddleware, async (req, res) => {
  const divisionId = req.params.divisionId;
  const user = req.user; // contains id, username, role, organisationalUnits, divisions.

  try {
    // Check if user belongs to this division.
    const belongsToDivision = user.divisions.map(String).includes(divisionId);

    if (!belongsToDivision) {
      return res.status(403).json({
        message: "Access denied. You do not belong to this division.",
      });
    }

    // Fetch credentials
    const credentials = await Credential.find({ division: divisionId });

    return res.json(credentials);
  } catch (err) {
    console.error("Error fetching credentials: ", err);
    return res.status(500).json({ message: "Server error fetching credentials." });
  }
});

// POST - Add a new credential for a division
router.post("/", authMiddleware, async (req, res) => {
  const { divisionId, name, username, password, notes } = req.body;
  const user = req.user; // user info decoded from JWT

  try {
    const belongsToDivision = user.divisions.map(String).includes(divisionId);

    // Check if user belongs to the division.
    if (!belongsToDivision) {
      return res.status(403).json({
        message: "Access denied. You do not belong to this division.",
      });
    }

    // Validate required fields.
    if (!divisionId || !name || !username || !password) {
      return res.status(400).json({
        message: "divisionId, name, username, and password are required.",
      });
    }

    // Save the credential in DB.
    const newCredential = await Credential.create({
      division: divisionId,
      name,
      username,
      password,
      notes: notes || "",
    });

    return res.json({
      message: "Credential added successfully.",
      credential: newCredential,
    });
  } catch (err) {
    console.error("Add credential error: ", err);
    return res.status(500).json({ message: "Server error adding credential." });
  }
});

// PUT - Update an existing credential
router.put("/:credentialId", authMiddleware, async (req, res) => {
  const credentialId = req.params.credentialId;
  const user = req.user;
  const updates = req.body;

  try {
    // Load the credential to find its division.
    const credential = await Credential.findById(credentialId);

    if (!credential) {
      return res.status(404).json({ message: "Credential not found." });
    }

    const divisionId = credential.division.toString();

    // Check if user belongs to this division
    const belongsToDivision = user.divisions.map(String).includes(divisionId);

    if (!belongsToDivision) {
      return res.status(403).json({
        message: "Access denied. You do not belong to this division.",
      });
    }

    // Check if user has permission to update.
    // Only management + admin allowed.
    if (user.role === "normal") {
      return res.status(403).json({
        message: "Only management and admin can update credentials.",
      });
    }

    // Update the credential.
    const updated = await Credential.findByIdAndUpdate(credentialId, updates, { new: true });

    return res.json({
      message: "Credential updated successfully.",
      credential: updated,
    });
  } catch (err) {
    console.error("Update credential error: ", err);
    return res.status(500).json({ message: "Server error updating credential." });
  }
});

module.exports = router;
