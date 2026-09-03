import { Schema, model } from "mongoose";
import type { HydratedDocument, Types } from "mongoose";

export interface IFinding {
  analysisId: Types.ObjectId;
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

export type FindingDocument = HydratedDocument<IFinding>;

const findingSchema = new Schema<IFinding>(
  {
    analysisId: {
      type: Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },

    lineStart: {
      type: Number,
      required: true,
      min: 1,
    },

    lineEnd: {
      type: Number,
      required: true,
      min: 1,
    },

    type: {
      type: String,
      enum: [
        "bug",
        "performance",
        "security",
        "maintainability",
        "readability",
        "best-practice",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    suggestion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Finding = model<IFinding>(
  "Finding",
  findingSchema,
);