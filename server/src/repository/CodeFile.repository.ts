import { CodeFile } from "../models/CodeFile.model.js";
import type {
  ICodeFile,
  CodeFileDocument,
} from "../models/CodeFile.model.js";

interface CreateCodeFileData {
  ownerId: ICodeFile["ownerId"];
  filename: string;
  language: string;
  content: string;
  expiresAt: Date;
}

class CodeFileRepository {
  async create(data: CreateCodeFileData): Promise<CodeFileDocument> {
    return CodeFile.create(data);
  }

  async findByOwnerId(
    ownerId: ICodeFile["ownerId"],
  ): Promise<CodeFileDocument | null> {
    return CodeFile.findOne({ ownerId });
  }

  async findByIdAndOwnerId(
    fileId: string,
    ownerId: ICodeFile["ownerId"],
  ): Promise<CodeFileDocument | null> {
    return CodeFile.findOne({
      _id: fileId,
      ownerId,
    });
  }

  async deleteById(
    fileId: string,
    ownerId: ICodeFile["ownerId"],
  ): Promise<CodeFileDocument | null> {
    return CodeFile.findOneAndDelete({
      _id: fileId,
      ownerId,
    });
  }
}

export const codeFileRepository = new CodeFileRepository();