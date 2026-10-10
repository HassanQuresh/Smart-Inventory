import "dotenv/config";
import bcrypt from "bcrypt";
import User from "../models/User";
import { connectDB, disconnectDB } from "../config/db";
import { registerSchema } from "../types/auth";

async function createManager() {
  const parsed = registerSchema.safeParse({
    username: process.env.MANAGER_USERNAME,
    password: process.env.MANAGER_PASSWORD,
  });

  if (!parsed.success) {
    throw new Error(
      `${parsed.error.issues.map((issue) => issue.message).join(". ")} ` +
        "(set MANAGER_USERNAME and MANAGER_PASSWORD in your .env file)",
    );
  }

  const { username, password } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error(`User "${username}" already exists.`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ username, passwordHash, role: "Manager" });

  console.log(`Manager "${username}" created successfully!`);
}

createManager()
  .catch((error) => {
    console.error(
      "Failed to create manager:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
