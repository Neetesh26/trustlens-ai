import { GoogleGenerativeAI } from "@google/generative-ai";
import { RawScanData } from "./scan.service";
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

    const prompt = `
You are a cybersecurity expert.

URL: ${scanData.url}
Score: ${scoreResult.trustScore}/100
Risk Level: ${scoreResult.riskLevel}

Threats: ${scoreResult.detectedThreats.join(", ") || "none"}

Write a short 2-3 line risk summary.
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