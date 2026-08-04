import { Router } from "express";
import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/projects/:projectId/tasks", protect, createTask);
router.get("/projects/:projectId/tasks", protect, getTasks);
router.get("/tasks/:taskId", protect, getTaskById);
router.patch("/tasks/:taskId", protect, updateTask);
router.patch("/tasks/:taskId/assign", protect, assignTask);
router.patch("/tasks/:taskId/status", protect, updateTaskStatus);
router.delete("/tasks/:taskId", protect, deleteTask);

export default router;
