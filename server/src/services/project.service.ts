import Project from "../models/project.model.js";
import type { IProject } from "../models/project.model.js";

export interface ICreateProjectInput {
  name: string;
  description?: string;
  status?: "planning" | "active" | "completed" | "on_hold";
}

export interface IUpdateProjectInput {
  name?: string;
  description?: string;
  status?: "planning" | "active" | "completed" | "on_hold";
}

const generateInviteCode = async () => {
  const code = `PROJ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const existingProject = await Project.findOne({ inviteCode: code });

  if (existingProject) {
    return generateInviteCode();
  }

  return code;
};

export class ProjectService {
  async createProject(input: ICreateProjectInput, userId: string) {
    if (!input.name || input.name.trim() === "") {
      throw new Error("Project name is required.");
    }

    const projectName = input.name.trim();
    const existingProjects = await Project.find({ owner: userId });

    for (const project of existingProjects) {
      if (project.name.trim().toLowerCase() === projectName.toLowerCase()) {
        throw new Error("You already have a project with this name.");
      }
    }

    const inviteCode = await generateInviteCode();

    const project = await Project.create({
      name: projectName,
      description: input.description || "",
      status: input.status || "planning",
      owner: userId,
      members: [userId],
      inviteCode,
    });

    return project;
  }

  async getProjects(userId: string) {
    return Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).sort({ createdAt: -1 });
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some(
      (member) => member.toString() === userId,
    );

    if (!isOwner && !isMember) {
      throw new Error("Access denied");
    }

    return project;
  }

  async updateProject(
    projectId: string,
    userId: string,
    input: IUpdateProjectInput,
  ) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw new Error("Only the owner can update this project.");
    }

    if (input.name !== undefined) {
      if (!input.name || input.name.trim() === "") {
        throw new Error("Project name is required.");
      }

      project.name = input.name.trim();
    }

    if (input.description !== undefined) {
      project.description = input.description;
    }

    const validStatuses = ["planning", "active", "completed", "on_hold"];

    if (input.status !== undefined) {
      if (!validStatuses.includes(input.status)) {
        throw new Error(
          `Invalid project status. Valid statuses are: ${validStatuses.join(", ")}`,
        );
      }

      project.status = input.status;
    }

    await project.save();

    return project;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw new Error("Only the owner can delete this project.");
    }

    await Project.deleteOne({ _id: project._id });

    return {
      message: "Project deleted successfully",
    };
  }
}

export const projectService = new ProjectService();
