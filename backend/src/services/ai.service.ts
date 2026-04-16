import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RawScanData } from "../types/scan.types";
import { ScoreResult } from "../types";
import { getEnv } from "../config/env";

const apiKey = getEnv("GEMINI_API_KEY")

console.log("API KEY LOADED:", apiKey ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(apiKey!);

export const generateAIRiskReport = async (
  scanData: RawScanData,
  scoreResult: ScoreResult
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
//     const models = await genAI.listModels();
// console.log(models);

    const prompt = `
You are a professional cybersecurity auditor and web security analyzer.

Analyze the website using the data below and provide:
1. A short 2-3 line risk summary
2. Include 1-2 actionable improvement suggestions (VERY SHORT)

Website Data:
- URL: ${scanData.url}
- Trust Score: ${scoreResult.trustScore}/100
- Risk Level: ${scoreResult.riskLevel}
- Detected Threats: ${scoreResult.detectedThreats.join(", ") || "none"}

Instructions:
- Keep response concise (max 3 lines)
- Mention key risk clearly
- Suggest practical fixes (e.g., enable HTTPS, fix headers, remove trackers)
- Do NOT explain too much
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text || "AI summary unavailable.";

  } catch (error: any) {
    console.error("❌ AI ERROR:", error.message);

    return `This site scored ${scoreResult.trustScore}/100 (${scoreResult.riskLevel}). Be cautious.`;
  }
};