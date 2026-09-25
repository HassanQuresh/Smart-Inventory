import { Request, Response, NextFunction } from "express";
import { authCredentialsSchema } from "../types/auth";
export function validateAuthCredentials(req: Request, res: Response, next: NextFunction) {
  try {
    const authDataResult = authCredentialsSchema.safeParse(req.body);
    if (!authDataResult.success) {
      return res.status(400).json({
        message: "Validation failed",
      });
    }
    req.body = authDataResult.data;
    next();
  } catch (error) {
    next(error);
  }
};