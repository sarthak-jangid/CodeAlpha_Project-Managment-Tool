import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { projectService } from "../services/project.service.js";

const sendProjectResponse = (res: Response, statusCode: number, payload: object) => {
  return res.status(statusCode).json({
    success: true,
    ...payload,
  });
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

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const project = await projectService.createProject(req.body, authReq.user._id.toString());

    return sendProjectResponse(res, 201, {
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projects = await projectService.getProjects(authReq.user._id.toString());

    return sendProjectResponse(res, 200, {
      projects,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const project = await projectService.getProjectById(projectId, authReq.user._id.toString());

    return sendProjectResponse(res, 200, {
      project,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const project = await projectService.updateProject(
      projectId,
      authReq.user._id.toString(),
      req.body
    );

    return sendProjectResponse(res, 200, {
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new Error("User not authenticated");
    }

    const projectId = getProjectId(req);
    const result = await projectService.deleteProject(projectId, authReq.user._id.toString());

    return sendProjectResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};
