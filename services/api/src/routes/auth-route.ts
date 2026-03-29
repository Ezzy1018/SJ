import { Router } from "express";
import {
  registerHandler,
  verifyOtpHandler,
} from "../controllers/auth-controller";
import { registerOtpLimiter, verifyOtpLimiter } from "../middleware/rate-limit";

const authRouter = Router();

authRouter.post("/register", registerOtpLimiter, registerHandler);
authRouter.post("/verify-otp", verifyOtpLimiter, verifyOtpHandler);

export default authRouter;
