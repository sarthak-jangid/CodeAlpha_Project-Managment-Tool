import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const message = err instanceof Error ? err.message : "Something went wrong";
  const statusCode = err instanceof Error && "statusCode" in err ? Number((err as { statusCode?: number }).statusCode) : 500;

  return res.status(statusCode || 500).json({
    success: false,
    message,
  });
};
