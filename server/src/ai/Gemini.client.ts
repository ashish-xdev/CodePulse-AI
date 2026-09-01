import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  analysisResponseSchema,
  type AnalysisResponse,
} from "../validators/Analysis.validator.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
  apiKey,
});

class GeminiClient {
  async analyzeCode(
    language: string,
    content: string,
  ): Promise<AnalysisResponse> {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
Analyze the following ${language} source code.

Identify meaningful:
- bugs
- performance issues
- security issues
- maintainability problems
- readability problems
- important best-practice improvements

Only report issues that are genuinely useful to the developer.

For every finding, identify the affected line range and explain
why the code should be improved.

Source code:

<code>
${content}
</code>
      `,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(analysisResponseSchema),
      },
    });

    const rawResponse = response.text;

    if (!rawResponse) {
      throw new Error("Gemini returned an empty response");
    }

    const parsedResponse: unknown = JSON.parse(rawResponse);

    return analysisResponseSchema.parse(parsedResponse);
  }
}

export const geminiClient = new GeminiClient();