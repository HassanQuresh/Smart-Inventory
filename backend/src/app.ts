import express from "express";
import productRoutes from "./routes/productRoutes";
const app = express();
app.use(express.json());
app.get("/", (req,res) => {
  res.send("Smart inventory API is running");
});
app.use("/products",productRoutes);
export default app;