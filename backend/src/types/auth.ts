import { z } from "zod";

export const jwtPayloadSchema = z.object({
  id: z.string(),
  role: z.enum(["Employee", "Manager"]),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password is too long (maximum 72 characters)",
      ),
  })
  .strict();

export const loginSchema = z
  .object({
    username: z.string().trim().toLowerCase().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();
