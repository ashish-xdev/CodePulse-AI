import express from "express";
import cors from "cors";
import { errorMiddleware } from "./errors/error.middleware.js";

import userRoutes from "./routes/User.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes will come here
app.use("/api/users", userRoutes);

// Global error handler — must be last
app.use(errorMiddleware);

export default app;