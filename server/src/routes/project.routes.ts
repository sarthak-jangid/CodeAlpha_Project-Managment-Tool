import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  joinProject,
  leaveProject,
  regenerateInviteCode,
  removeProjectMember,
  updateProject,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema, joinProjectSchema, updateProjectSchema } from "../schemas/project.schema.js";

const router = Router();

// Project CURD Oprations ....
router.post("/", protect, validate(createProjectSchema), createProject);
router.get("/", protect, getProjects);
router.get("/:projectId", protect, getProjectById);
router.patch("/:projectId", protect, validate(updateProjectSchema), updateProject);
router.delete("/:projectId", protect, deleteProject);


// end-points for project membership management ...
router.post("/join", protect, validate(joinProjectSchema), joinProject);
router.post("/:projectId/leave", protect, leaveProject);
router.get("/:projectId/members", protect, getProjectMembers);
router.delete("/:projectId/members/:memberId", protect, removeProjectMember);
router.patch("/:projectId/invite-code", protect, regenerateInviteCode);

export default router;