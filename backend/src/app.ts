import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Smart inventory API is running");
});
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);
export default app;
