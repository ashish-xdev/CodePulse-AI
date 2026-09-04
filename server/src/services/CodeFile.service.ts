import { Types } from "mongoose";
import { codeFileRepository } from "../repository/CodeFile.repository.js";
import { AppError } from "../errors/AppError.js";

interface CreateCodeFileData {
  ownerId: string;
  filename: string;
  language: string;
  content: string;
}

class CodeFileService {
  async create(data: CreateCodeFileData) {
    const lineCount = data.content.split(/\r?\n/).length;

    if (lineCount > 500) {
      throw new AppError(
        "Code file cannot contain more than 500 lines",
        400,
      );
    }

    const ownerId = new Types.ObjectId(data.ownerId);

    const existingFile = await codeFileRepository.findByOwnerId(
      ownerId,
    );

    if (existingFile) {
      await codeFileRepository.deleteById(
        existingFile._id.toString(),
        ownerId,
      );
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const codeFile = await codeFileRepository.create({
      ownerId,
      filename: data.filename,
      language: data.language,
      content: data.content,
      expiresAt,
    });

    return codeFile;
  }

  async refreshExpiry(fileId: string, ownerId: string) {
    if (!Types.ObjectId.isValid(fileId)) {
      throw new AppError("Invalid code file ID", 400);
    }

    if (!Types.ObjectId.isValid(ownerId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const updatedFile = await codeFileRepository.updateExpiry(
      fileId,
      new Types.ObjectId(ownerId),
      expiresAt,
    );

    if (!updatedFile) {
      throw new AppError("Code file not found", 404);
    }

    return updatedFile;
  }
}

export const codeFileService = new CodeFileService();