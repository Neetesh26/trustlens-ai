import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnv } from '../config/env';
// import { logger } from '../config/logger';
import { RawScanData } from './scan.service';
import { ScoreResult } from './score.service';

const genAI = new GoogleGenerativeAI(getEnv("GEMINI_API_KEY"));

export const generateAIRiskReport = async (
  scanData: RawScanData,
  scoreResult: ScoreResult
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a cybersecurity expert analyzing a website for potential risks.

Website Analysis Data:
- URL: ${scanData.url}
- SSL/HTTPS: ${scanData.hasSSL ? 'Yes' : 'No'}
- Trust Score: ${scoreResult.trustScore}/100
- Risk Level: ${scoreResult.riskLevel.toUpperCase()}
- External Scripts: ${scanData.externalScripts.length}
- Trackers Found: ${scanData.trackers.join(', ') || 'none'}
- Suspicious JS Patterns: ${scanData.suspiciousKeywords.join(', ') || 'none'}
- Password Form Without SSL: ${scanData.passwordFormsWithoutSSL}
- Iframes: ${scanData.iframeCount}
- Hidden Elements: ${scanData.hiddenElements}
- Detected Threats: ${scoreResult.detectedThreats.join('; ') || 'none'}

Score Breakdown:
- SSL: ${scoreResult.breakdown.ssl}/20
- Scripts: ${scoreResult.breakdown.scripts}/20
- Forms: ${scoreResult.breakdown.forms}/20
- Cookies: ${scoreResult.breakdown.cookies}/20
- Phishing Indicators: ${scoreResult.breakdown.phishing}/20

Write a 3-4 sentence professional risk assessment summary for a non-technical user.
Be direct, clear, and actionable. Mention specific risks found.
If the site is safe, explain why it appears trustworthy.
Do not use markdown formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();

  } catch (error) {
    console.log('AI service error:', error);
    // Fallback summary without AI
    return `This website received a trust score of ${scoreResult.trustScore}/100 (${scoreResult.riskLevel}). ${
      scoreResult.detectedThreats.length > 0
        ? `Key concerns: ${scoreResult.detectedThreats.slice(0, 2).join('; ')}.`
        : 'No major threats were detected.'
    } Exercise caution and verify the site's legitimacy before providing personal information.`;
  }
};