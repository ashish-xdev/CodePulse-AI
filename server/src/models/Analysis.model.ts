import { Schema, model } from "mongoose";
import type { HydratedDocument, Types } from "mongoose";

export interface IAnalysis {
  codeFileId: Types.ObjectId;
  summary?: string;
  overallScore?: number;
  status: "pending" | "completed" | "failed";
  expiresAt: Date;
}

export type AnalysisDocument = HydratedDocument<IAnalysis>;

const analysisSchema = new Schema<IAnalysis>(
  {
    codeFileId: {
      type: Schema.Types.ObjectId,
      ref: "CodeFile",
      required: true,
    },

    summary: {
      type: String,
      trim: true,
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
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

analysisSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const Analysis = model<IAnalysis>(
  "Analysis",
  analysisSchema
);