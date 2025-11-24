function requireDivisionAccess(req, res, next) {
  const userDivisions = req.user.divisions; // array of IDs

  // The division being accessed.
  const targetDivisionId = req.params.divisionId;

  // Checks the membership.
  if (!userDivisions.includes(targetDivisionId)) {
    return res.status(403).json({
      message: "Access denied. You are not part of this division.",
    });
  }

  next();
}

module.exports = { requireDivisionAccess };
