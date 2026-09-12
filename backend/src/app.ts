import express from "express";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Smart inventory API is running");
});
app.use("/products", productRoutes);
app.use(errorHandler);
export default app;
