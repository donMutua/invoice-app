import rateLimit from "express-rate-limit";
import { systemLogs } from "../utils/logger.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    systemLogs.error(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).json({
      success: false,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20,
  message:
    "Too many Login attempts from this IP, please try again after 30 minutes",
  handler: (req, res, next, options) => {
    systemLogs.error(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).json({
      success: false,
      message:
        "Too many Login attempts from this IP, please try again after 30 minutes",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
