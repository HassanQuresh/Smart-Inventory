import { z } from "zod";

const productShape = {
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(
      /^[A-Za-z0-9 -]+$/,
      "Name can only contain letters, numbers, spaces and hyphens",
    ),
  price: z
    .number({ error: "Price must be a number" })
    .min(0.01, "Price must be at least $0.01")
    .max(1_000_000, "Price is too large")
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
      "Price can have at most 2 decimal places",
    ),
  stock: z
    .int({ error: "Stock must be a whole number" })
    .min(0, "Stock cannot be negative")
    .max(1_000_000, "Stock is too large"),
  category: z
    .string({ error: "Category is required" })
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters"),
};

// POST / PUT: every field required, no extra fields allowed
export const createProductSchema = z.strictObject(productShape);

// PATCH: any subset of fields, but at least one
export const updateProductSchema = z
  .strictObject(productShape)
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

export const stockChangeSchema = z.strictObject({
  change: z
    .int({ error: "Change must be a whole number" })
    .min(-1_000_000, "Change is too large")
    .max(1_000_000, "Change is too large")
    .refine((value) => value !== 0, "Change cannot be zero"),
});
