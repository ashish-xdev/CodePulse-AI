import { Schema, model } from "mongoose";
import type { HydratedDocument, Types } from "mongoose";

export interface IVerification {
  analysisId: Types.ObjectId;
  syntaxValid: boolean;
  improvedCodePresent: boolean;
  status: "passed" | "failed";
  message: string;
  expiresAt: Date;
}

export type VerificationDocument =
  HydratedDocument<IVerification>;

const verificationSchema = new Schema<IVerification>(
  {
    analysisId: {
      type: Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },

    syntaxValid: {
      type: Boolean,
      required: true,
    },

    improvedCodePresent: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: ["passed", "failed"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

verificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export const Verification = model<IVerification>(
  "Verification",
  verificationSchema,
);