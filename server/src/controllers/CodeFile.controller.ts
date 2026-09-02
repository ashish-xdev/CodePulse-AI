import type { Request, Response } from "express";
import { codeFileService } from "../services/CodeFile.service.js";

class CodeFileController {
  async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { filename, language, content } = req.body;

    const codeFile = await codeFileService.create({
      ownerId: req.user.userId,
      filename,
      language,
      content,
    });

    res.status(201).json({
      message: "Code file uploaded successfully",
      codeFile,
    });
  }
}

export const codeFileController = new CodeFileController();