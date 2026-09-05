import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  validateCompleteProduct,
  validatePartialProduct,
} from "../middleware/productValidation";
const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validateCompleteProduct, createProduct);
router.put("/:id", validateCompleteProduct, replaceProduct);
router.patch("/:id", validatePartialProduct, updateProduct);
router.delete("/:id", deleteProduct);
export default router;