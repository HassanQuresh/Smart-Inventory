import { validate } from "./validate";
import { registerSchema, loginSchema } from "../types/auth";

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
