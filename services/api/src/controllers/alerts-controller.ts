import { Request, Response } from "express";
import { z } from "zod";
import {
  createAlert,
  deleteAlertForUser,
  getUserAlerts,
} from "../services/alert-service";

const createAlertSchema = z.object({
  type: z.enum(["below", "above", "specific"]),
  price: z.number().positive(),
  karat: z.union([z.literal(18), z.literal(22), z.literal(24)]),
  city: z.enum([
    "jaipur",
    "delhi",
    "mumbai",
    "bangalore",
    "hyderabad",
    "pune",
    "kolkata",
    "chennai",
  ]),
  frequency: z.enum(["daily", "triggered", "weekly"]).default("triggered"),
});

export const createAlertHandler = (req: Request, res: Response): void => {
  const authUserId = req.user?.uid;
  if (!authUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = createAlertSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }

  try {
    const alert = createAlert({ ...parsed.data, userId: authUserId });
    res.status(201).json({ alertId: alert.id, status: alert.status });
  } catch (error) {
    if (error instanceof Error && error.message === "ALERT_LIMIT_REACHED") {
      res.status(409).json({ error: "Max 3 active alerts per user" });
      return;
    }
    res.status(500).json({ error: "Failed to create alert" });
  }
};

export const getUserAlertsHandler = (req: Request, res: Response): void => {
  const authUserId = req.user?.uid;
  if (!authUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userId = req.params.userId;
  if (authUserId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const alerts = getUserAlerts(userId);
  res.json({ alerts });
};

export const deleteAlertHandler = (req: Request, res: Response): void => {
  const authUserId = req.user?.uid;
  if (!authUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const deleted = deleteAlertForUser(authUserId, req.params.alertId);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Alert not found" });
    return;
  }

  res.json({ success: true });
};
