import type { Request, Response } from "express";
import { analysisService } from "../services/Analysis.service.js";

class AnalysisController {
  async analyze(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { codeFileId } = req.body;

    const result = await analysisService.analyze({
      codeFileId,
      ownerId: req.user.userId,
    });

    res.status(200).json(result);
  }
}

export const analysisController = new AnalysisController();