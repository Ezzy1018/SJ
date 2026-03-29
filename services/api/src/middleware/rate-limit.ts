import { Request } from "express";
import rateLimit from "express-rate-limit";
import { getPendingPhoneByUserId } from "../services/auth-service";

const resolveUserOrIp = (req: Request): string => {
  if (req.user?.uid) {
    return `uid:${req.user.uid}`;
  }
  return `ip:${req.ip}`;
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

export const pricesCurrentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveUserOrIp,
  message: { error: "Rate limit exceeded for current prices" },
});

export const pricesHistoryLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveUserOrIp,
  message: { error: "Rate limit exceeded for price history" },
});

export const alertsWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveUserOrIp,
  message: { error: "Rate limit exceeded for alerts" },
});

export const calculatorLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: resolveUserOrIp,
  message: { error: "Rate limit exceeded for calculator" },
});

export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const requestId =
      typeof req.body?.userId === "string" ? req.body.userId : "";
    const phone = requestId ? getPendingPhoneByUserId(requestId) : undefined;
    return phone ? `phone:${phone}` : `ip:${req.ip}`;
  },
  message: { error: "Too many OTP attempts. Try again after 15 minutes." },
});

export const registerOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const phone = typeof req.body?.phone === "string" ? req.body.phone : "";
    return phone ? `phone:${phone}` : `ip:${req.ip}`;
  },
  message: { error: "Too many OTP requests. Try again later." },
});
