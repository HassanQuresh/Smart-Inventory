import { z } from "zod";

export const jwtPayloadSchema = z.object({
  id: z.string(),
  role: z.enum(["Employee", "Manager"]),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const authCredentialsSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 charactersd")
}).strict();

export type UserProfile = z.infer<typeof authCredentialsSchema>;