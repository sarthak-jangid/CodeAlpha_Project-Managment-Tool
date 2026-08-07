import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { commentService } from "../services/comment.service.js";

const sendCommentResponse = (res: Response, statusCode: number, payload: object) => {
  return res.status(statusCode).json({
    success: true,
    ...payload,
  });
};

const getTaskId = (req: Request): string => {
  const taskId = req.params.taskId;

  if (Array.isArray(taskId)) {
    throw new Error("Invalid task id");
  }

  if (typeof taskId !== "string" || taskId.trim() === "") {
    throw new Error("Invalid task id");
  }

  return taskId;
};

const getProjectId = (req: Request): string => {
  const projectId = req.params.projectId;

  if (Array.isArray(projectId)) {
    throw new Error("Invalid project id");
  }

  if (typeof projectId !== "string" || projectId.trim() === "") {
    throw new Error("Invalid project id");
  }

  return projectId;
};

const getCommentId = (req: Request): string => {
  const commentId = req.params.commentId;

  if (Array.isArray(commentId)) {
    throw new Error("Invalid comment id");
  }

  if (typeof commentId !== "string" || commentId.trim() === "") {
    throw new Error("Invalid comment id");
  }

  return commentId;
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const comment = await commentService.createComment(taskId, authReq.user._id.toString(), req.body);

    return sendCommentResponse(res, 201, {
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProjectComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const comment = await commentService.createProjectComment(projectId, authReq.user._id.toString(), req.body);

    return sendCommentResponse(res, 201, {
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const comments = await commentService.getCommentsByTask(taskId, authReq.user._id.toString());

    return sendCommentResponse(res, 200, {
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProjectComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const comments = await commentService.getCommentsByProject(projectId, authReq.user._id.toString());

    return sendCommentResponse(res, 200, {
      comments,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const commentId = getCommentId(req);
    const comment = await commentService.updateComment(commentId, authReq.user._id.toString(), req.body);

    return sendCommentResponse(res, 200, {
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const commentId = getCommentId(req);
    const result = await commentService.deleteComment(commentId, authReq.user._id.toString());

    return sendCommentResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};
