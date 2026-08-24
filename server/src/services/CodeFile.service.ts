import { codeFileRepository } from "../repository/CodeFile.repository.js";
import { AppError } from "../errors/AppError.js";
import type { ICodeFile } from "../models/CodeFile.model.js";

interface CreateCodeFileData {
  ownerId: ICodeFile["ownerId"];
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

    const existingFile = await codeFileRepository.findByOwnerId(
      data.ownerId,
    );

    if (existingFile) {
      await codeFileRepository.deleteById(
        existingFile._id.toString(),
        data.ownerId,
      );
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const codeFile = await codeFileRepository.create({
      ownerId: data.ownerId,
      filename: data.filename,
      language: data.language,
      content: data.content,
      expiresAt,
    });

    return codeFile;
  }
}

export const codeFileService = new CodeFileService();