import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues.map((issue) => issue.message).join(". "),
      });
    }
    req.body = result.data; // cleaned data: trimmed, no unknown fields
    next();
  };
}
