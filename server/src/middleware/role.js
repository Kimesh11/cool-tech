function requireRole(requiredRole) {
  return (req, res, next) => {
    // User's role.
    const userRole = req.user.role;

    // role access levels.
    const roleRank = {
      normal: 1,
      management: 2,
      admin: 3,
    };

    // Checks required vs actual role.
    if (roleRank[userRole] < roleRank[requiredRole]) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${requiredRole}`,
      });
    }

    next();
  };
}

module.exports = { requireRole };
