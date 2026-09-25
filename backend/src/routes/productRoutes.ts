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
  validateUpdateStock,
} from "../middleware/productValidation";
import { protect, authorize } from "../middleware/authMiddleware";
const router = express.Router();
router.get("/", protect, authorize(["Manager", "Employee"]), getProducts);
router.get("/:id", protect, authorize(["Manager", "Employee"]), getProduct);
router.post(
  "/",
  protect,
  authorize(["Manager"]),
  validateCompleteProduct,
  createProduct,
);
router.put(
  "/:id",
  protect,
  authorize(["Manager"]),
  validateCompleteProduct,
  replaceProduct,
);
router.patch(
  "/:id",
  protect,
  authorize(["Manager"]),
  validatePartialProduct,
  updateProduct,
);
router.patch(
  "/:id/stock",
  protect,
  authorize(["Manager", "Employee"]),
  validateUpdateStock,
  updateStock,
);
router.delete("/:id", protect, authorize(["Manager"]), deleteProduct);
export default router;
