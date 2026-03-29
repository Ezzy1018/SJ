import cors from "cors";
import express from "express";
import helmet from "helmet";
import pricesRouter from "./routes/prices-route";
import alertsRouter from "./routes/alerts-route";
import calculatorRouter from "./routes/calculator-route";
import authRouter from "./routes/auth-route";
import usersRouter from "./routes/users-route";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { forceHttps } from "./middleware/https";
import { globalRateLimiter } from "./middleware/rate-limit";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(forceHttps);
app.use(globalRateLimiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use((_req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "sj-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/prices", pricesRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/calculator", calculatorRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
