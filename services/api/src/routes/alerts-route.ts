import { Router } from "express";
import {
  createAlertHandler,
  deleteAlertHandler,
  getUserAlertsHandler,
} from "../controllers/alerts-controller";
import { requireAuth } from "../middleware/auth";
import { alertsWriteLimiter } from "../middleware/rate-limit";

const alertsRouter = Router();

alertsRouter.use(requireAuth);

alertsRouter.post("/create", alertsWriteLimiter, createAlertHandler);
alertsRouter.get("/user/:userId", getUserAlertsHandler);
alertsRouter.delete("/:alertId", deleteAlertHandler);

export default alertsRouter;
