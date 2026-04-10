const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const logger = require("../utils/logger");

// ─── Helpers ────────────────────────────────────────────────────────────────

const ACCESS_EXPIRY  = "15m";
const REFRESH_EXPIRY = "7d";

function generateTokens(payload) {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
    { expiresIn: REFRESH_EXPIRY }
  );
  return { accessToken, refreshToken };
}

function sendRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// ─── Validation rules ────────────────────────────────────────────────────────

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 60 }),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    // Auto-login: generate tokens
    const payload = { id: user._id, email: user.email, name: user.name, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Persist refresh token
    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshCookie(res, refreshToken);

    logger.info("New user registered and logged in", { email });
    res.status(201).json({ 
      accessToken, 
      name: user.name, 
      role: user.role, 
      photo: user.photo || null,
      message: "Registered and logged in successfully" 
    });
  } catch (err) {
    logger.error("Register error", { error: err.message });
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Failed login attempt", { email, ip: req.ip });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { id: user._id, email: user.email, name: user.name, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Persist hashed refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshCookie(res, refreshToken);

    logger.info("User logged in", { userId: user._id });
    res.json({ accessToken, name: user.name, role: user.role, photo: user.photo || null });
  } catch (err) {
    logger.error("Login error", { error: err.message });
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// POST /api/auth/refresh  — rotate refresh token
router.post("/refresh", async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh"
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      // Possible token reuse — revoke
      if (user) { user.refreshToken = null; await user.save(); }
      return res.status(403).json({ message: "Invalid refresh token. Please log in again." });
    }

    const payload = { id: user._id, email: user.email, name: user.name, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    sendRefreshCookie(res, newRefreshToken);
    res.json({ accessToken });
  } catch (err) {
    logger.warn("Refresh token invalid/expired", { error: err.message });
    res.status(403).json({ message: "Session expired. Please log in again." });
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh"
      );
      const user = await User.findById(decoded.id);
      if (user) { user.refreshToken = null; await user.save(); }
    } catch {/* token already invalid — that's fine */}
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// POST /api/auth/google  — called from frontend after Firebase sign-in
router.post("/google", async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, photo });
      logger.info("New Google user created", { email });
    }

    const payload = { id: user._id, email: user.email, name: user.name, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    user.refreshToken = refreshToken;
    if (photo && !user.photo) user.photo = photo;
    await user.save();

    sendRefreshCookie(res, refreshToken);
    res.json({ accessToken, name: user.name, role: user.role, photo: user.photo || null });
  } catch (err) {
    logger.error("Google auth error", { error: err.message });
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;