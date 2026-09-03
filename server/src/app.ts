import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./errors/error.middleware.js";
import userRoutes from "./routes/User.routes.js";
import codeFileRoutes from "./routes/CodeFile.routes.js";
import analysisRoutes from "./routes/Analysis.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/codefiles", codeFileRoutes);
app.use("/api/analyses", analysisRoutes);

// Global error handler — must be last
app.use(errorMiddleware);

export default app;