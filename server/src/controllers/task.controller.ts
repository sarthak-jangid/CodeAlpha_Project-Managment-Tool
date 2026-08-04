import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { taskService } from "../services/task.service.js";

const sendTaskResponse = (res: Response, statusCode: number, payload: object) => {
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

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const task = await taskService.createTask(projectId, authReq.user._id.toString(), req.body);

    return sendTaskResponse(res, 201, {
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const tasks = await taskService.getTasksByProject(projectId, authReq.user._id.toString());

    return sendTaskResponse(res, 200, {
      tasks,
    });
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const task = await taskService.getTaskById(taskId, authReq.user._id.toString());

    return sendTaskResponse(res, 200, {
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const task = await taskService.updateTask(taskId, authReq.user._id.toString(), req.body);

    return sendTaskResponse(res, 200, {
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export const assignTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const task = await taskService.assignTask(taskId, authReq.user._id.toString(), req.body);

    return sendTaskResponse(res, 200, {
      message: "Task assigned successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const task = await taskService.updateTaskStatus(taskId, authReq.user._id.toString(), req.body);

    return sendTaskResponse(res, 200, {
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const taskId = getTaskId(req);
    const result = await taskService.deleteTask(taskId, authReq.user._id.toString());

    return sendTaskResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};
