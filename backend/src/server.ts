import "dotenv/config";
import app from "./app";
import { connectDB, disconnectDB } from "./config/db";

const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
const missing = requiredEnv.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

if ((process.env.JWT_SECRET as string).length < 32) {
  console.warn(
    "Warning: JWT_SECRET is short. Use at least 32 random characters.",
  );
}

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  function shutdown(signal: string) {
    console.log(`${signal} received. Shutting down...`);
    setTimeout(() => process.exit(1), 10000).unref(); // force exit if it hangs
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
