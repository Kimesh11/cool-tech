const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const Division = require("../models/division.model");
const OrganisationalUnit = require("../models/ou.model");

const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// GET - Return all users for admin panel
router.get("/users", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().populate("divisions").populate("organisationalUnits");

    res.json(users);
  } catch (err) {
    console.error("Get users error: ", err);
    res.status(500).json({ message: "Server error fetching users." });
  }
});

// POST - Assign a user to a division.
router.post("/assignDivision", authMiddleware, requireRole("admin"), async (req, res) => {
  const { userId, divisionId } = req.body;

  try {
    // Validate division.
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: "Division not found." });
    }

    // Add division to user.
    await User.findByIdAndUpdate(userId, {
      $addToSet: { divisions: divisionId },
    });

    res.json({ message: "User assigned to division successfully." });
  } catch (err) {
    console.error("Assign division error: ", err);
    res.status(500).json({ message: "Server error assigning division." });
  }
});

// POST - Unassign a user from a division
router.post("/unassignDivision", authMiddleware, requireRole("admin"), async (req, res) => {
  const { userId, divisionId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { divisions: divisionId },
    });

    res.json({ message: "User removed from division." });
  } catch (err) {
    console.error("Unassign division error: ", err);
    res.status(500).json({ message: "Server error removing division." });
  }
});

// POST - Assign a user to an OU
router.post("/assignOU", authMiddleware, requireRole("admin"), async (req, res) => {
  const { userId, ouId } = req.body;

  try {
    const ou = await OrganisationalUnit.findById(ouId);
    if (!ou) {
      return res.status(404).json({ message: "OU not found." });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { organisationalUnits: ouId },
    });

    res.json({ message: "User assigned to OU successfully." });
  } catch (err) {
    console.error("Assign OU error: ", err);
    res.status(500).json({ message: "Server error assigning OU." });
  }
});

// POST - Unassign user from OU
router.post("/unassignOU", authMiddleware, requireRole("admin"), async (req, res) => {
  const { userId, ouId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { organisationalUnits: ouId },
    });

    res.json({ message: "User removed from OU." });
  } catch (err) {
    console.error("Unassign OU error: ", err);
    res.status(500).json({ message: "Server error removing OU." });
  }
});

// PUT - Change user role
router.put("/changeRole", authMiddleware, requireRole("admin"), async (req, res) => {
  const { userId, newRole } = req.body;

  const validRoles = ["normal", "management", "admin"];

  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    await User.findByIdAndUpdate(userId, { role: newRole });

    res.json({ message: "User role updated successfully." });
  } catch (err) {
    console.error("Change role error: ", err);
    res.status(500).json({ message: "Server error updating role." });
  }
});

module.exports = router;
