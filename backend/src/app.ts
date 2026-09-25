import express from "express";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Smart inventory API is running");
});
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use(errorHandler);
export default app;
