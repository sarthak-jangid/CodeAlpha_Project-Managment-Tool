import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { verifyToken } from "../utils/jwt.js";
import { Types } from "mongoose";

export interface AuthenticatedUser {
  _id: Types.ObjectId;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Read JWT from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // 2. Verify JWT
    const payload = verifyToken(token);

    // 3. Get current user
    const { user } = await authService.getCurrentUser(payload.userId);

    // 4. Attach user to request
    (req as AuthenticatedRequest).user = user;

    // 5. Continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};