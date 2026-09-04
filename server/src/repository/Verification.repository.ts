import { Verification } from "../models/Verification.model.js";
import type {
  IVerification,
  VerificationDocument,
} from "../models/Verification.model.js";

interface CreateVerificationData {
  analysisId: IVerification["analysisId"];
  syntaxValid: boolean;
  improvedCodePresent: boolean;
  status: IVerification["status"];
  message: string;
  expiresAt: Date;
}

class VerificationRepository {
  async create(
    data: CreateVerificationData,
  ): Promise<VerificationDocument> {
    return Verification.create(data);
  }

  async findByAnalysisId(
    analysisId: IVerification["analysisId"],
  ): Promise<VerificationDocument | null> {
    return Verification.findOne({ analysisId });
  }

  async deleteByAnalysisId(
    analysisId: IVerification["analysisId"],
  ): Promise<VerificationDocument | null> {
    return Verification.findOneAndDelete({ analysisId });
  }
}

export const verificationRepository =
  new VerificationRepository();