import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:projectId", protect, getProjectById);
router.patch("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);

export default router;
