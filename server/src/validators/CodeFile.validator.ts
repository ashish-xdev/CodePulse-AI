import { z } from "zod";

export const createCodeFileSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(255, "Filename is too long"),

  language: z
    .string()
    .min(1, "Language is required")
    .max(50, "Language is too long"),

  content: z
    .string()
    .min(1, "Code content is required"),
});

export type CreateCodeFileRequest = z.infer<
  typeof createCodeFileSchema
>;