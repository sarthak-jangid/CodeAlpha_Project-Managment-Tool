import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(["planning", "active", "completed", "on_hold"]).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  status: z.enum(["planning", "active", "completed", "on_hold"]).optional(),
});

export const joinProjectSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^PROJ-[A-Z0-9]{6}$/,
      "Invite code must be in the format PROJ-XXXXXX"
    ),
});