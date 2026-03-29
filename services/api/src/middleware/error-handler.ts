import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status =
    err instanceof HttpError
      ? err.status
      : typeof (err as { status?: number })?.status === "number"
        ? Number((err as { status?: number }).status)
        : 500;

  if (status >= 500) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
    return;
  }

  const message = err instanceof Error ? err.message : "Bad request";
  res.status(status).json({ error: message });
};
