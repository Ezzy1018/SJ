import { Request, Response } from "express";
import { z } from "zod";
import { registerUser, verifyOtp } from "../services/auth-service";

const registerSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/),
  name: z.string().min(2).max(80),
  website: z.string().optional().default(""),
});

const verifySchema = z.object({
  userId: z.string().min(1),
  otp: z.string().length(6),
});

export const registerHandler = (req: Request, res: Response): void => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  // Honeypot bot protection: legitimate clients keep this field empty.
  if (parsed.data.website.trim().length > 0) {
    res.status(201).json({ status: "OTP_SENT" });
    return;
  }

  const result = registerUser(parsed.data.phone, parsed.data.name);
  res.status(201).json(result);
};

export const verifyOtpHandler = (req: Request, res: Response): void => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  try {
    const result = verifyOtp(parsed.data.userId, parsed.data.otp);
    res.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "INVALID_OTP" ||
        error.message === "OTP_EXPIRED" ||
        error.message === "OTP_ALREADY_USED")
    ) {
      res.status(401).json({ error: "Invalid OTP" });
      return;
    }

    if (error instanceof Error && error.message === "OTP_RATE_LIMITED") {
      res
        .status(429)
        .json({ error: "Too many OTP attempts. Try again after 15 minutes." });
      return;
    }

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(500).json({ error: "OTP verification failed" });
  }
};
