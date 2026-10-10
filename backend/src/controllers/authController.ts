import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ username, passwordHash });
    await user.save();
    res.status(201).json({
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
}
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isMatch = await bcrypt.compare(
      password,
      user?.passwordHash ?? DUMMY_HASH,
    );
    if (!user || !isMatch) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    next(error);
  }
}
export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.user.id).select("username role");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}
