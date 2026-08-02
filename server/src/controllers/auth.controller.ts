import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const sendAuthResponse = (res: Response, statusCode: number, payload: object) => {
  return res.status(statusCode).json({
    success: true,
    ...payload,
  });
};


// Register ...
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendAuthResponse(res, 201, {
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendAuthResponse(res, 200, {
      message: "Logged in successfully",
      user: result.user,
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return sendAuthResponse(res, 200, {
    message: "Logged out successfully",
  });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    return sendAuthResponse(res, 200, {
      user: authReq.user,
    });
  } catch (error) {
    return next(error);
  }
};
