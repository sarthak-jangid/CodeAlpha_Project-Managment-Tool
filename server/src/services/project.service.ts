import mongoose from "mongoose";
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

  async joinProject(inviteCode: string, userId: string) {
    if (!inviteCode || inviteCode.trim() === "") {
      throw new Error("Invalid invite code");
    }

    const project = await Project.findOne({ inviteCode: inviteCode.trim() });

    if (!project) {
      throw new Error("Invalid invite code");
    }

    const isMember = project.members.some((member) => member.toString() === userId);

    if (isMember) {
      throw new Error("You are already a member");
    }

    project.members.push(new mongoose.Types.ObjectId(userId));
    await project.save();

    return {
      message: "Joined project successfully",
      project,
    };
  }

  async leaveProject(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.owner.toString() === userId) {
      throw new Error("Owner cannot leave the project");
    }

    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isMember) {
      throw new Error("You are not a member");
    }

    project.members = project.members.filter((member) => member.toString() !== userId);
    await project.save();

    return {
      message: "Left project successfully",
    };
  }

  async getProjectMembers(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isOwner && !isMember) {
      throw new Error("Access denied");
    }

    const populatedProject = await Project.findById(projectId).populate(
      "members",
      "name username email avatar"
    );

    return populatedProject?.members || [];
  }

  async removeProjectMember(projectId: string, memberId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw new Error("Only the owner can remove members");
    }

    if (project.owner.toString() === memberId) {
      throw new Error("Owner cannot remove themselves");
    }

    const isMember = project.members.some((member) => member.toString() === memberId);

    if (!isMember) {
      throw new Error("Member not found in this project");
    }

    project.members = project.members.filter((member) => member.toString() !== memberId);
    await project.save();

    return {
      message: "Member removed successfully",
    };
  }

  async regenerateInviteCode(projectId: string, userId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.owner.toString() !== userId) {
      throw new Error("Only the owner can regenerate the invite code");
    }

    const inviteCode = await generateInviteCode();
    project.inviteCode = inviteCode;
    await project.save();

    return {
      inviteCode,
    };
  }
}

export const projectService = new ProjectService();
