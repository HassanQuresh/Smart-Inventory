import { validate } from "./validate";
import {
  createProductSchema,
  updateProductSchema,
  stockChangeSchema,
} from "../types/product";

export const validateCompleteProduct = validate(createProductSchema);
export const validatePartialProduct = validate(updateProductSchema);
export const validateUpdateStock = validate(stockChangeSchema);
