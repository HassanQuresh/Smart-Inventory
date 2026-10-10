import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { registerLimiter, loginLimiter } from "../middleware/rateLimiter";
import { validateRegister, validateLogin } from "../middleware/authValidation";
const router = express.Router();
router.post("/register", registerLimiter, validateRegister, registerUser);
router.post("/login", loginLimiter, validateLogin, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);
export default router;
