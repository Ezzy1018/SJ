import { NextFunction, Request, Response } from "express";
import { getEnv } from "../config/env";

export const forceHttps = (req: Request, res: Response, next: NextFunction) => {
  const { NODE_ENV } = getEnv();
  if (NODE_ENV !== "production") {
    next();
    return;
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0]
      : undefined;

  if (req.secure || protocol === "https") {
    next();
    return;
  }

  const host = req.headers.host ?? "";
  res.redirect(301, `https://${host}${req.originalUrl}`);
};
