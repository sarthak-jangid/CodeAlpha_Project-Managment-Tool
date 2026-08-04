import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/tasks/:taskId/comments", protect, createComment);
router.get("/tasks/:taskId/comments", protect, getComments);
router.patch("/comments/:commentId", protect, updateComment);
router.delete("/comments/:commentId", protect, deleteComment);

export default router;
