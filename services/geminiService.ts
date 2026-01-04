
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCropHealth = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // When using generate content, you must use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analyze this plant image for diseases or nutrient deficiencies. Provide a professional diagnosis, confidence level (0-1), a list of recommendations, and specific treatment instructions.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            treatment: { type: Type.STRING },
          },
          required: ["diagnosis", "confidence", "recommendations", "treatment"],
        },
      },
    });

    // The GenerateContentResponse object features a text property (not a method) that directly returns the string output.
    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze crop health. Please try again.");
  }
};
