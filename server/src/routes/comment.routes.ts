import { Router } from "express";
import {
  createComment,
  createProjectComment,
  deleteComment,
  getComments,
  getProjectComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCommentSchema, updateCommentSchema } from "../schemas/comment.schema.js";

const router = Router();

router.post("/tasks/:taskId/comments", protect, validate(createCommentSchema), createComment);
router.get("/tasks/:taskId/comments", protect, getComments);
router.get("/projects/:projectId/comments", protect, getProjectComments);
router.post("/projects/:projectId/comments", protect, validate(createCommentSchema), createProjectComment);
router.patch("/comments/:commentId", protect, validate(updateCommentSchema), updateComment);
router.delete("/comments/:commentId", protect, deleteComment);

export default router;
