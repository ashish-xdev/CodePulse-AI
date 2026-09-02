import { Router } from "express";
import { codeFileController } from "../controllers/CodeFile.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCodeFileSchema } from "../validators/CodeFile.validator.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createCodeFileSchema),
  codeFileController.create,
);

export default router;