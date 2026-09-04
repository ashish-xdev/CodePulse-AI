import type { Request, Response } from "express";
import { verificationService } from "../services/Verification.service.js";

class VerificationController {
  async verify(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { analysisId } = req.body;

    const verification = await verificationService.verify({
      analysisId,
      ownerId: req.user.userId,
    });

    res.status(200).json({
      message: "Verification completed successfully",
      verification,
    });
  }
}

export const verificationController =
  new VerificationController();