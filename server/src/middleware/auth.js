// Reused the code from the previous auth task.
const jwt = require("jsonwebtoken");

// Secret key.
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  // Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];

  // Validation for missing header.
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header." });
  }

  const [type, token] = authHeader.split(" ");

  // Validates structure.
  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Authorization must look like: Bearer <token>",
    });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // decodedUser = { id, username, role, divisions: [], organisationalUnits: [] }
    req.user = decodedUser;

    next();
  });
}

module.exports = { authMiddleware, JWT_SECRET };
