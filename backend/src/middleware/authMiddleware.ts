import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from 'zod';
import { jwtPayloadSchema } from "../types/auth";
export function authorize(allowedRoles: ("Manager" | "Employee")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user data missing",
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.user.role}' does not have permission to perform this action`,
      });
    }
    next();
  };
}

export function protect(req: Request, res: Response, next: NextFunction) {
  const envResult = z.string().min(1).safeParse(process.env.JWT_SECRET);
  
  if (!envResult.success) {
    throw new Error("JWT_SECRET environment variable is missing or empty");
  }
  const JWT_SECRET = envResult.data;
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
    return; 
  }

  try {
    const rawDecoded = jwt.verify(token, JWT_SECRET);
    const payloadResult = jwtPayloadSchema.safeParse(rawDecoded);

    if (!payloadResult.success) {
       res.status(401).json({ 
        message: "Invalid token"
      });
      return;
    }
    req.user = payloadResult.data; 

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}