require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// express-mongo-sanitize is incompatible with Express 5 (req.query is read-only).
// We sanitize req.body manually — that's where NoSQL injection risk lives.
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    const sanitize = (obj) => {
      for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
}
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const connectDB = require("./db");
const logger = require("./utils/logger");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const menuRoutes = require("./routes/menu");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Core Security Middleware ─────────────────────────────────────────────────

// Secure HTTP headers
app.use(helmet());

// CORS — allow frontend origins + credentials (for cookies)
const ALLOWED_ORIGINS = [
  "https://food-delish.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Parse cookies (needed for refresh token HttpOnly cookie)
app.use(cookieParser());

// NoSQL injection prevention (body-only; Express 5 req.query is read-only)
app.use(sanitizeBody);

// Gzip compression
app.use(compression());

// ─── Rate Limiting ────────────────────────────────────────────────────────────

// Strict limit on auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api/", apiLimiter);

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });
  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});