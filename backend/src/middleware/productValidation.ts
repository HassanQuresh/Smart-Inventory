import { Request, Response, NextFunction } from "express";
export function validateCompleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, price, stock, category } = req.body;
  if (
    name === undefined ||
    price === undefined ||
    stock === undefined ||
    category === undefined
  ) {
    res.status(400).json({
      message: "Name, price, stock and category are required",
    });
    return;
  }
  if (
    typeof name !== "string" ||
    name.trim() !== name ||
    name.length < 3 ||
    name.length > 100 ||
    !/^[A-Za-z \-]+$/.test(name)
  ) {
    res.status(400).json({
      message:
        "Name must be 3-100 characters and contain only letters, spaces and hyphens",
    });
    return;
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0.01) {
    res.status(400).json({
      message: "Price must be a number greater than or equal to $0.01",
    });
    return;
  }
  if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
    res.status(400).json({
      message: "Stocks must be non-negative integer",
    });
    return;
  }
  if (typeof category !== "string" || category.trim() === "") {
    res.status(400).json({
      message: "Category is required",
    });
    return;
  }
  next();
}
export function validatePartialProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, price, stock, category } = req.body;
  if (
    name === undefined &&
    price === undefined &&
    stock === undefined &&
    category === undefined
  ) {
    res.status(400).json({
      message: "Name, price, stock or category is required",
    });
    return;
  }
  if (
    name !== undefined &&
    (name.trim() !== name ||
      name.length < 3 ||
      name.length > 100 ||
      !/^[A-Za-z \-]+$/.test(name))
  ) {
    res.status(400).json({
      message:
        "Name must be 3-100 characters and contain only letters, spaces and hyphens",
    });
    return;
  }
  if (
    price !== undefined &&
    (typeof price !== "number" || !Number.isFinite(price) || price < 0.01)
  ) {
    res.status(400).json({
      message: "Price must be a number greater than or equal to $0.01",
    });
    return;
  }
  if (
    stock !== undefined &&
    (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0)
  ) {
    res.status(400).json({
      message: "Stock must a non-negative integer",
    });
    return;
  }
  if (
    category !== undefined &&
    (typeof category !== "string" || category.trim() === "")
  ) {
    res.status(400).json({
      message: "Category must be non-empty string",
    });
    return;
  }
  next();
};
