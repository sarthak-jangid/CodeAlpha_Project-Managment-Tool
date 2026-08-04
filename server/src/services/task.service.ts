import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export interface ICreateTaskInput {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: Date | string;
  assignedTo?: string;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: Date | string;
}

export interface IAssignTaskInput {
  assignedTo: string;
}

export interface IUpdateTaskStatusInput {
  status: "Todo" | "In_Progress" | "Review" | "Done";
}

export class TaskService {
  private async getProjectOrThrow(projectId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  private async getTaskOrThrow(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  private async getUserOrThrow(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  private isOwner(project: any, userId: string) {
    return project.owner.toString() === userId;
  }

  private isMember(project: any, userId: string) {
    return project.members.some((member: any) => member.toString() === userId);
  }

  private async validateProjectAccess(project: any, userId: string) {
    const isOwner = this.isOwner(project, userId);
    const isMember = this.isMember(project, userId);

    if (!isOwner && !isMember) {
      throw new Error("Access denied");
    }
  }

  private isDueDateInPast(dateValue: Date | string | undefined) {
    if (!dateValue) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dateValue);

    return dueDate < today;
  }

  async createTask(projectId: string, userId: string, input: ICreateTaskInput) {
    if (!input.title || input.title.trim() === "") {
      throw new Error("Task title is required.");
    }

    const project = await this.getProjectOrThrow(projectId);

    if (!this.isOwner(project, userId)) {
      throw new Error("Only the owner can create tasks.");
    }

    if (this.isDueDateInPast(input.dueDate)) {
      throw new Error("Due date cannot be in the past.");
    }

    let assignedTo: mongoose.Types.ObjectId | undefined;

    if (input.assignedTo) {
      const user = await this.getUserOrThrow(input.assignedTo);
      const isProjectMember = project.members.some(
        (member: any) => member.toString() === user._id.toString(),
      );

      if (!isProjectMember) {
        throw new Error("Assigned user must be a member of this project.");
      }

      assignedTo = user._id;
    }

    const task = await Task.create({
      title: input.title.trim(),
      description: input.description || "",
      priority: input.priority || "medium",
      project: project._id,

      ...(input.dueDate && {
        dueDate: new Date(input.dueDate),
      }),

      ...(assignedTo && {
        assignedTo,
      }),
    });

    return task;
  }

  async getTasksByProject(projectId: string, userId: string) {
    const project = await this.getProjectOrThrow(projectId);
    await this.validateProjectAccess(project, userId);

    return Task.find({ project: project._id })
      .populate("assignedTo", "name username email avatar")
      .sort({ createdAt: -1 });
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());
    await this.validateProjectAccess(project, userId);

    return Task.findById(task._id).populate(
      "assignedTo",
      "name username email avatar",
    );
  }

  async updateTask(taskId: string, userId: string, input: IUpdateTaskInput) {
    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());

    if (!this.isOwner(project, userId)) {
      throw new Error("Only the owner can update this task.");
    }

    if (input.title !== undefined) {
      if (!input.title || input.title.trim() === "") {
        throw new Error("Task title is required.");
      }

      task.title = input.title.trim();
    }

    if (input.description !== undefined) {
      task.description = input.description;
    }

    if (input.priority !== undefined) {
      task.priority = input.priority;
    }

    if (input.dueDate !== undefined) {
      if (this.isDueDateInPast(input.dueDate)) {
        throw new Error("Due date cannot be in the past.");
      }

      task.dueDate = new Date(input.dueDate);
    }

    await task.save();

    return task;
  }

  async assignTask(taskId: string, userId: string, input: IAssignTaskInput) {
    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());

    if (!this.isOwner(project, userId)) {
      throw new Error("Only the owner can assign tasks.");
    }

    const assignedUser = await this.getUserOrThrow(input.assignedTo);
    const isProjectMember = project.members.some(
      (member: any) => member.toString() === assignedUser._id.toString(),
    );

    if (!isProjectMember) {
      throw new Error("Assigned user must be a member of this project.");
    }

    if (task.assignedTo && task.assignedTo.toString() === assignedUser._id.toString()) {
      throw new Error("Task is already assigned to this member.");
    }

    task.assignedTo = assignedUser._id;
    await task.save();

    return task;
  }

  async updateTaskStatus(
    taskId: string,
    userId: string,
    input: IUpdateTaskStatusInput,
  ) {
    const task = await this.getTaskOrThrow(taskId);

    if (!task.assignedTo) {
      throw new Error("Task must be assigned before updating its status.");
    }

    if (task.assignedTo.toString() !== userId) {
      throw new Error("Only the assigned user can update the task status.");
    }

    const validStatuses = ["Todo", "In_Progress", "Review", "Done"];

    if (!validStatuses.includes(input.status)) {
      throw new Error(
        `Invalid task status. Valid statuses are: ${validStatuses.join(", ")}`,
      );
    }

    if (task.status === input.status) {
      throw new Error("Task already has this status.");
    }

    task.status = input.status;
    await task.save();

    return task;
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());

    if (!this.isOwner(project, userId)) {
      throw new Error("Only the owner can delete this task.");
    }

    await Task.deleteOne({ _id: task._id });

    return {
      message: "Task deleted successfully",
    };
  }
}

export const taskService = new TaskService();
