import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getFirebaseAuth } from "../config/firebase";

const unauthorized = (res: Response) => {
  res.status(401).json({ error: "Unauthorized" });
};

const parseBearerToken = (headerValue?: string): string | null => {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }
  return headerValue.slice("Bearer ".length).trim();
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = parseBearerToken(req.headers.authorization);
  if (!token) {
    unauthorized(res);
    return;
  }

  try {
    const decoded = (await getFirebaseAuth().verifyIdToken(
      token,
      true,
    )) as DecodedIdToken;
    req.user = decoded;
    next();
  } catch {
    unauthorized(res);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const claim = req.user?.admin;
  if (!claim) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
};
