import { Router } from "express";
import { calculateValueHandler } from "../controllers/calculator-controller";
import { calculatorLimiter } from "../middleware/rate-limit";

const calculatorRouter = Router();

calculatorRouter.post("/", calculatorLimiter, calculateValueHandler);

export default calculatorRouter;
