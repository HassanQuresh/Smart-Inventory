import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  console.error("Application Error:", err);
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid product ID",
    });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
    });
  }
  return res.status(500).json({
    message: "Internal server error",
  });
}
