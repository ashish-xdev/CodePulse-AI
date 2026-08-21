import { Router } from "express";
import { userController } from "../controllers/User.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "../validators/User.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerUserSchema), userController.register);
router.post("/login", validate(loginUserSchema), userController.login);
router.get("/me", authMiddleware, userController.me);
router.post("/logout", authMiddleware, userController.logout);

export default router;
