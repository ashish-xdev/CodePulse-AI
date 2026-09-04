import { Types } from "mongoose";
import { findingRepository } from "../repository/Finding.repository.js";
import { AppError } from "../errors/AppError.js";

interface CreateFindingData {
  analysisId: string;
  lineStart: number;
  lineEnd: number;
  type:
    | "bug"
    | "performance"
    | "security"
    | "maintainability"
    | "readability"
    | "best-practice";
  severity:
    | "low"
    | "medium"
    | "high"
    | "critical";
  title: string;
  description: string;
  suggestion: string;
}

class FindingService {
  async create(data: CreateFindingData) {
    if (!Types.ObjectId.isValid(data.analysisId)) {
      throw new AppError("Invalid analysis ID", 400);
    }

    const analysisId = new Types.ObjectId(data.analysisId);

    if (data.lineEnd < data.lineStart) {
      throw new AppError(
        "Finding lineEnd cannot be less than lineStart",
        400,
      );
    }

    return findingRepository.create({
      analysisId,
      lineStart: data.lineStart,
      lineEnd: data.lineEnd,
      type: data.type,
      severity: data.severity,
      title: data.title,
      description: data.description,
      suggestion: data.suggestion,
    });
  }

  async createMany(data: CreateFindingData[]) {
    if (data.length === 0) {
      return [];
    }

    const findings = data.map((finding) => {
      if (!Types.ObjectId.isValid(finding.analysisId)) {
        throw new AppError("Invalid analysis ID", 400);
      }

      if (finding.lineEnd < finding.lineStart) {
        throw new AppError(
          "Finding lineEnd cannot be less than lineStart",
          400,
        );
      }

      return {
        analysisId: new Types.ObjectId(finding.analysisId),
        lineStart: finding.lineStart,
        lineEnd: finding.lineEnd,
        type: finding.type,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
        suggestion: finding.suggestion,
      };
    });

    return findingRepository.createMany(findings);
  }

  async getByAnalysisId(analysisId: string) {
    if (!Types.ObjectId.isValid(analysisId)) {
      throw new AppError("Invalid analysis ID", 400);
    }

    return findingRepository.findByAnalysisId(
      new Types.ObjectId(analysisId),
    );
  }

  async deleteByAnalysisId(analysisId: string) {
    if (!Types.ObjectId.isValid(analysisId)) {
      throw new AppError("Invalid analysis ID", 400);
    }

    return findingRepository.deleteByAnalysisId(
      new Types.ObjectId(analysisId),
    );
  }
}

export const findingService = new FindingService();