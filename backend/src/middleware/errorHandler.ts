import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  console.error("Application Error:", err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body too large" });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Resource already exists",
    });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: "Invalid ID",
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
