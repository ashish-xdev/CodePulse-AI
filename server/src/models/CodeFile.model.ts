import { Schema, model } from "mongoose";
import type { HydratedDocument, Types } from "mongoose";

export interface ICodeFile {
  ownerId: Types.ObjectId;
  filename: string;
  language: string;
  content: string;
  expiresAt: Date;
}

export type CodeFileDocument = HydratedDocument<ICodeFile>;

const codeFileSchema = new Schema<ICodeFile>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filename: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

codeFileSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const CodeFile = model<ICodeFile>("CodeFile", codeFileSchema);