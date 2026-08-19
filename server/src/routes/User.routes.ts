import { Router } from "express";
import { userController } from "../controllers/User.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerUserSchema } from "../validators/User.validator.js";

const router = Router();

router.post("/register", validate(registerUserSchema), userController.register);

export default router;

