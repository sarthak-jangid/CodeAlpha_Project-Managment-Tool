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
import { validate } from "../middleware/validate.middleware.js";
import { assignTaskSchema, createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../schemas/task.schema.js";

const router = Router();

router.post("/projects/:projectId/tasks", protect, validate(createTaskSchema), createTask);
router.get("/projects/:projectId/tasks", protect, getTasks);
router.get("/tasks/:taskId", protect, getTaskById);
router.patch("/tasks/:taskId", protect, validate(updateTaskSchema), updateTask);
router.patch("/tasks/:taskId/assign", protect, validate(assignTaskSchema), assignTask);
router.patch("/tasks/:taskId/status", protect, validate(updateTaskStatusSchema), updateTaskStatus);
router.delete("/tasks/:taskId", protect, deleteTask);

export default router;
