import { z } from "zod";

export const verificationRequestSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
});

export type VerificationRequest = z.infer<
  typeof verificationRequestSchema
>;