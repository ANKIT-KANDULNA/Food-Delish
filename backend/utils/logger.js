const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "fooddelish-api" },
  transports: [
    // Write all errors to error.log
    new transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
    // Write all logs to combined.log
    new transports.File({ filename: path.join(logsDir, "combined.log") }),
  ],
});

// In dev, also log to console with colors
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const extras = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
          return `[${timestamp}] ${level}: ${message} ${extras}`;
        })
      ),
    })
  );
}

module.exports = logger;
