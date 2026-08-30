import { Analysis } from "../models/Analysis.model.js";
import type {
  IAnalysis,
  AnalysisDocument,
} from "../models/Analysis.model.js";

interface CreateAnalysisData {
  codeFileId: IAnalysis["codeFileId"];
  expiresAt: Date;
}

interface UpdateAnalysisResultData {
  summary: string;
  overallScore: number;
  status: "completed" | "failed";
}

class AnalysisRepository {
  async create(data: CreateAnalysisData): Promise<AnalysisDocument> {
    return Analysis.create(data);
  }

  async findByCodeFileId(
    codeFileId: IAnalysis["codeFileId"],
  ): Promise<AnalysisDocument | null> {
    return Analysis.findOne({ codeFileId });
  }

  async updateResult(
    analysisId: string,
    data: UpdateAnalysisResultData,
  ): Promise<AnalysisDocument | null> {
    return Analysis.findByIdAndUpdate(
      analysisId,
      data,
      { new: true },
    );
  }

  async deleteByCodeFileId(
    codeFileId: IAnalysis["codeFileId"],
  ): Promise<AnalysisDocument | null> {
    return Analysis.findOneAndDelete({ codeFileId });
  }
}

export const analysisRepository = new AnalysisRepository();