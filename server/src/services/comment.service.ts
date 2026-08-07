import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Comment from "../models/comment.model.js";

export interface ICreateCommentInput {
  message: string;
}

export interface IUpdateCommentInput {
  message?: string;
}

export class CommentService {
  private async getTaskOrThrow(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  private async getProjectOrThrow(projectId: string) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  private async getCommentOrThrow(commentId: string) {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    return comment;
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

  async createComment(taskId: string, userId: string, input: ICreateCommentInput) {
    if (!input.message || input.message.trim() === "") {
      throw new Error("Comment message is required.");
    }

    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());
    await this.validateProjectAccess(project, userId);

    const comment = await Comment.create({
      message: input.message.trim(),
      task: task._id,
      author: userId,
    });

    return comment;
  }

  async createProjectComment(projectId: string, userId: string, input: ICreateCommentInput) {
    if (!input.message || input.message.trim() === "") {
      throw new Error("Comment message is required.");
    }

    const project = await this.getProjectOrThrow(projectId);
    await this.validateProjectAccess(project, userId);

    const comment = await Comment.create({
      message: input.message.trim(),
      project: project._id,
      author: userId,
    });

    return comment;
  }

  async getCommentsByTask(taskId: string, userId: string) {
    const task = await this.getTaskOrThrow(taskId);
    const project = await this.getProjectOrThrow(task.project.toString());
    await this.validateProjectAccess(project, userId);

    return Comment.find({ task: task._id })
      .populate("author", "name username avatar")
      .sort({ createdAt: 1 });
  }

  async getCommentsByProject(projectId: string, userId: string) {
    const project = await this.getProjectOrThrow(projectId);
    await this.validateProjectAccess(project, userId);

    return Comment.find({ project: project._id })
      .populate("author", "name username avatar")
      .sort({ createdAt: 1 });
  }

  async updateComment(commentId: string, userId: string, input: IUpdateCommentInput) {
    const comment = await this.getCommentOrThrow(commentId);

    if (!input.message || input.message.trim() === "") {
      throw new Error("Comment message is required.");
    }

    if (comment.author.toString() !== userId) {
      throw new Error("Only the author can update this comment.");
    }

    const trimmedMessage = input.message.trim();

    if (comment.message === trimmedMessage) {
      throw new Error("Comment already has this message.");
    }

    comment.message = trimmedMessage;
    await comment.save();

    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.getCommentOrThrow(commentId);

    let project;
    const taskId = comment.task?.toString();

    if (taskId) {
      const task = await this.getTaskOrThrow(taskId);
      project = await this.getProjectOrThrow(task.project.toString());
    } else if (comment.project) {
      project = await this.getProjectOrThrow(comment.project.toString());
    } else {
      throw new Error("Comment is not linked to a task or project.");
    }

    const isAuthor = comment.author.toString() === userId;
    const isOwner = this.isOwner(project, userId);

    if (!isAuthor && !isOwner) {
      throw new Error("Access denied");
    }

    await Comment.deleteOne({ _id: comment._id });

    return {
      message: "Comment deleted successfully",
    };
  }
}

export const commentService = new CommentService();
