import { z } from "zod";

export const analysisRequestSchema = z.object({
  codeFileId: z.string().min(1, "Code file ID is required"),
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;