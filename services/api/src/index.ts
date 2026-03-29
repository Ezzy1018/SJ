import "dotenv/config";
import app from "./app";
import { getEnv } from "./config/env";

let port = 4000;

try {
  const env = getEnv();
  port = env.PORT;
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Invalid environment configuration";
  console.error(`Startup configuration error: ${message}`);
  process.exit(1);
}

app.listen(port, () => {
  // Startup log for local and CI environments.
  console.log(`SJ API listening on http://localhost:${port}`);
});
