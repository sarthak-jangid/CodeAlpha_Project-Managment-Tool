import { z } from "zod";

export const createCommentSchema = z.object({
 message: z.string().trim().min(1).max(1000)
});

export const updateCommentSchema = z.object({
  message: z.string().trim().min(1).max(1000)
});
