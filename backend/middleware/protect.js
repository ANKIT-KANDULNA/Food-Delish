const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Verify access token
function protect(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated — token missing" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn("Invalid access token", { error: err.message, ip: req.ip });
    return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
  }
}

// Admin-only guard (applied after protect)
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied — admins only" });
  }
  next();
}

module.exports = { protect, adminOnly };