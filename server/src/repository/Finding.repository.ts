import { Finding } from "../models/Finding.model.js";
import type {
  IFinding,
  FindingDocument,
} from "../models/Finding.model.js";

interface CreateFindingData {
  analysisId: IFinding["analysisId"];
  lineStart: number;
  lineEnd: number;
  type: IFinding["type"];
  severity: IFinding["severity"];
  title: string;
  description: string;
  suggestion: string;
}

class FindingRepository {
  async create(
    data: CreateFindingData,
  ): Promise<FindingDocument> {
    return Finding.create(data);
  }

  async createMany(
    data: CreateFindingData[],
  ): Promise<FindingDocument[]> {
    return Finding.insertMany(data);
  }

  async findByAnalysisId(
    analysisId: IFinding["analysisId"],
  ): Promise<FindingDocument[]> {
    return Finding.find({ analysisId });
  }

  async deleteByAnalysisId(
    analysisId: IFinding["analysisId"],
  ): Promise<{ deletedCount?: number }> {
    return Finding.deleteMany({ analysisId });
  }
}

export const findingRepository = new FindingRepository();