import { z } from "zod";

export const analysisResponseSchema = z.object({
  summary: z.string().min(1),
  overallScore: z.number().int().min(0).max(100),
  improvedCode: z.string().min(1),

  findings: z.array(
    z.object({
      lineStart: z.number().int().positive(),
      lineEnd: z.number().int().positive(),

      type: z.enum([
        "bug",
        "performance",
        "security",
        "maintainability",
        "readability",
        "best-practice",
      ]),

      severity: z.enum([
        "low",
        "medium",
        "high",
        "critical",
      ]),

      title: z.string().min(1),
      description: z.string().min(1),
      suggestion: z.string().min(1),
    }),
  ),
});

export type AnalysisResponse = z.infer<
  typeof analysisResponseSchema
>;