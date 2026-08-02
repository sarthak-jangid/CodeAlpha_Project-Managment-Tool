// import User from './models/user.model.js';
// import Project from './models/project.model.js';
// import Task from './models/task.model.js';
// import Comment from './models/comment.model.js';

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

// import projectRoutes from "./routes/project.routes.js";
// import taskRoutes from "./routes/task.routes.js";
// import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;