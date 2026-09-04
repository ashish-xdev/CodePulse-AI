import { Router } from "express";
import { verificationController } from "../controllers/Verification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { verificationRequestSchema } from "../validators/VerificationRequest.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(verificationRequestSchema),
  verificationController.verify,
);

export default router;