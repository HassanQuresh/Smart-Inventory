import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  replaceProduct,
  updateProduct,
  updateStock,
  deleteProduct,
} from "../controllers/productController";
import {
  validateCompleteProduct,
  validatePartialProduct,
  validateUpdateStock
} from "../middleware/productValidation";
const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validateCompleteProduct, createProduct);
router.put("/:id", validateCompleteProduct, replaceProduct);
router.patch("/:id", validatePartialProduct, updateProduct);
router.patch("/:id/stock", validateUpdateStock, updateStock);
router.delete("/:id", deleteProduct);
export default router;