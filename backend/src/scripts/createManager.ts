import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
import "dotenv/config.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User";
import { connectDB } from "../config/db";
async function createManager() {
  await connectDB();
  const username = "manager";
  const password = "YOUR_PASSWORD_HERE";
  const passwordHash = await bcrypt.hash(password, 12);
  const manager = new User({
    username,
    passwordHash,
    role: "Manager",
  });
  await manager.save();
  console.log("Manager created successfully!");
  await mongoose.connection.close();
}
createManager();
