import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().min(1).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.string().datetime().optional(),
});

export const assignTaskSchema = z.object({
  assignedTo: z.string().min(1),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(["Todo", "In_Progress", "Review", "Done"]),
});
