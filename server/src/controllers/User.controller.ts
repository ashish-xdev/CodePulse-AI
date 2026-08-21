import type { Request, Response } from "express";
import { userService } from "../services/User.service.js";

class UserController {
  async register(req: Request, res: Response) {
    const user = await userService.register(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, token } = await userService.login(email, password);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  }

  async me(req: Request, res: Response) {
    const user = await userService.getCurrentUser(req.user!.userId);
    return res.status(200).json({
      user,
    });
  }

  async logout(_req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}
}

export const userController = new UserController();
