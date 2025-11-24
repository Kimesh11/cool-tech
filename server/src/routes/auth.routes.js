const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");
const User = require("../models/user.model.js");

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER - (default role = "normal")
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Make sure user enters both fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default role.
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "normal",
    });

    // Return success
    res.json({ message: "Registration successful!" });
  } catch (err) {
    console.log("Register error: ", err);
    res.status(500).json({ message: "Error registering user." });
  }
});

// LOGIN - (returns JWT token on success)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if both fields exist
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
    }

    // Look for the user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Check if password matches the hash in DB
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create JWT token.
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        divisions: user.divisions,
        organisationalUnits: user.organisationalUnits,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token lasts 1 hour
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Login error: ", err);
    res.status(500).json({ message: "Error logging in." });
  }
});

// GET - Return logged-in user's details.
router.get("/userDetails", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("organisationalUnits").populate("divisions");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      organisationalUnits: user.organisationalUnits,
      divisions: user.divisions,
    });
  } catch (err) {
    console.log("ME endpoint error: ", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
