import { Router } from "express";
import {
  getCurrentPricesHandler,
  getPriceHistoryHandler,
} from "../controllers/prices-controller";
import {
  pricesCurrentLimiter,
  pricesHistoryLimiter,
} from "../middleware/rate-limit";

const pricesRouter = Router();

pricesRouter.get("/current", pricesCurrentLimiter, getCurrentPricesHandler);
pricesRouter.get("/history", pricesHistoryLimiter, getPriceHistoryHandler);

export default pricesRouter;
