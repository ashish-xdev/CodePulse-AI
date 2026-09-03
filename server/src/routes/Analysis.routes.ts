import { Router } from "express";
import { analysisController } from "../controllers/Analysis.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { analysisRequestSchema } from "../validators/AnalysisRequest.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(analysisRequestSchema),
  analysisController.analyze,
);

export default router;