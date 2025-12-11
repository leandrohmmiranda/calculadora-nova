import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will be disabled or mocked.");
    // In a real scenario, we might throw or handle this, but to prevent app crash if env is missing:
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const solveWithGemini = async (input: string): Promise<{ result: string, explanation: string }> => {
  const ai = getAiClient();
  if (!ai) {
    return { result: "Error", explanation: "API Key missing." };
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a specialized mathematical calculation assistant.
      User Input: "${input}"
      
      Your tasks:
      1. Solve the math problem provided in the input. It might be a simple expression or a word problem (e.g., "15% of 200").
      2. Provide the numeric result clearly.
      3. Provide a very brief, one-sentence explanation or the step taken.
      
      Output Format (JSON):
      {
        "result": "the numeric answer",
        "explanation": "short explanation"
      }
      
      Do not include markdown code blocks. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    return {
      result: parsed.result?.toString() || "Error",
      explanation: parsed.explanation || "Could not explain."
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      result: "Error",
      explanation: "Failed to process with AI."
    };
  }
};
