import { Types } from "mongoose";
import { codeFileRepository } from "../repository/CodeFile.repository.js";
import { analysisRepository } from "../repository/Analysis.repository.js";
import { findingRepository } from "../repository/Finding.repository.js";
import { geminiClient } from "../ai/Gemini.client.js";
import { AppError } from "../errors/AppError.js";

interface AnalyzeCodeData {
  codeFileId: string;
  ownerId: string;
}

class AnalysisService {
  async analyze(data: AnalyzeCodeData) {
    if (!Types.ObjectId.isValid(data.codeFileId)) {
      throw new AppError("Invalid code file ID", 400);
    }

    if (!Types.ObjectId.isValid(data.ownerId)) {
      throw new AppError("Invalid user ID", 400);
    }
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
          improvedCode: result.improvedCode,
          status: "completed",
        },
      );

      if (!updatedAnalysis) {
        throw new AppError("Analysis not found", 404);
      }

      await findingRepository.deleteByAnalysisId(
        analysis._id,
      );

      await findingRepository.createMany(
        result.findings.map((finding) => ({
          analysisId: analysis._id,
          lineStart: finding.lineStart,
          lineEnd: finding.lineEnd,
          type: finding.type,
          severity: finding.severity,
          title: finding.title,
          description: finding.description,
          suggestion: finding.suggestion,
        })),
      );

      return {
        analysis: updatedAnalysis,
        findings: result.findings,
      };
    } catch (error) {
      await analysisRepository.updateResult(
        analysis._id.toString(),
        {
          summary: "Analysis failed",
          overallScore: 0,
          status: "failed",
        },
      );

      throw error;
    }
  }
}

export const analysisService = new AnalysisService();