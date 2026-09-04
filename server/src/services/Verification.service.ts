import { Types } from "mongoose";
import { analysisRepository } from "../repository/Analysis.repository.js";
import { codeFileRepository } from "../repository/CodeFile.repository.js";
import { verificationRepository } from "../repository/Verification.repository.js";
import { AppError } from "../errors/AppError.js";

interface VerifyAnalysisData {
  analysisId: string;
  ownerId: string;
}

class VerificationService {
  async verify(data: VerifyAnalysisData) {
    if (!Types.ObjectId.isValid(data.analysisId)) {
      throw new AppError("Invalid analysis ID", 400);
    }

    const analysisId = new Types.ObjectId(data.analysisId);
    const ownerId = new Types.ObjectId(data.ownerId);

    const analysis = await analysisRepository.findById(
      data.analysisId,
    );

    if (!analysis) {
      throw new AppError("Analysis not found", 404);
    }

    const codeFile = await codeFileRepository.findByIdAndOwnerId(
      analysis.codeFileId.toString(),
      ownerId,
    );

    if (!codeFile) {
      throw new AppError("Analysis not found", 404);
    }

    const improvedCodePresent =
      typeof analysis.improvedCode === "string" &&
      analysis.improvedCode.trim().length > 0;

    const syntaxValid = this.performBasicSyntaxCheck(
      analysis.improvedCode,
    );

    const status =
      improvedCodePresent && syntaxValid
        ? "passed"
        : "failed";

    const message =
      status === "passed"
        ? "Improved code passed basic verification"
        : "Improved code failed basic verification";

    const existingVerification =
      await verificationRepository.findByAnalysisId(
        analysisId,
      );

    if (existingVerification) {
      await verificationRepository.deleteByAnalysisId(
        analysisId,
      );
    }

    return verificationRepository.create({
      analysisId,
      syntaxValid,
      improvedCodePresent,
      status,
      message,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  private performBasicSyntaxCheck(
    code: string | undefined,
  ): boolean {
    if (!code || code.trim().length === 0) {
      return false;
    }

    const openingBraces = (code.match(/{/g) ?? []).length;
    const closingBraces = (code.match(/}/g) ?? []).length;

    const openingParentheses =
      (code.match(/\(/g) ?? []).length;
    const closingParentheses =
      (code.match(/\)/g) ?? []).length;

    const openingBrackets =
      (code.match(/\[/g) ?? []).length;
    const closingBrackets =
      (code.match(/]/g) ?? []).length;

    return (
      openingBraces === closingBraces &&
      openingParentheses === closingParentheses &&
      openingBrackets === closingBrackets
    );
  }
}

export const verificationService =
  new VerificationService();