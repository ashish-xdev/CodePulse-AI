import { Types } from "mongoose";
import { codeFileRepository } from "../repository/CodeFile.repository.js";
import { analysisRepository } from "../repository/Analysis.repository.js";
import { geminiClient } from "../ai/Gemini.client.js";
import { AppError } from "../errors/AppError.js";
import type { ICodeFile } from "../models/CodeFile.model.js";

interface AnalyzeCodeData {
  codeFileId: string;
  ownerId: string;
}

class AnalysisService {
  async analyze(data: AnalyzeCodeData) {
    const codeFile = await codeFileRepository.findByIdAndOwnerId(
      data.codeFileId,
      new Types.ObjectId(data.ownerId),
    );

    if (!codeFile) {
      throw new AppError("Code file not found", 404);
    }

    const existingAnalysis = await analysisRepository.findByCodeFileId(
      codeFile._id,
    );

    const analysis =
      existingAnalysis ??
      (await analysisRepository.create({
        codeFileId: codeFile._id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      }));

    try {
      const result = await geminiClient.analyzeCode(
        codeFile.language,
        codeFile.content,
      );

      const updatedAnalysis = await analysisRepository.updateResult(
        analysis._id.toString(),
        {
          summary: result.summary,
          overallScore: result.overallScore,
          status: "completed",
        },
      );

      if (!updatedAnalysis) {
        throw new AppError("Analysis not found", 404);
      }

      return {
        analysis: updatedAnalysis,
        findings: result.findings,
      };
    } catch (error) {
      await analysisRepository.updateResult(analysis._id.toString(), {
        summary: "Analysis failed",
        overallScore: 0,
        status: "failed",
      });

      throw error;
    }
  }
}

export const analysisService = new AnalysisService();
