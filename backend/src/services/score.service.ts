import { RawScanData } from './scan.service';
import { ScoreResult } from '../types';

export const calculateTrustScore = (data: RawScanData): ScoreResult => {
  let score = 100;
  const threats: string[] = [];

  // SSL
  if (!data.hasSSL) {
    score -= 40;
    threats.push("No SSL encryption");
  }

  // Suspicious JS
  if (data.suspiciousKeywords.length > 0) {
    score -= 20;
    threats.push("Suspicious JavaScript detected");
  }

  // Password without SSL
  if (data.passwordFormsWithoutSSL) {
    score -= 40;
    threats.push("Password form on insecure page");
  }

  // Trackers
  if (data.trackers.length > 3) {
    score -= 15;
    threats.push("Too many trackers");
  }

  // Phishing indicators
  if (data.iframeCount > 2) {
    score -= 15;
    threats.push("Multiple iframes detected");
  }

  if (data.hiddenElements > 3) {
    score -= 15;
    threats.push("Hidden elements detected");
  }

  // 🔥 URL phishing detection
  const url = data.url.toLowerCase();
  const keywords = ["login", "verify", "secure", "bank", "paypal"];

  const matches = keywords.filter(k => url.includes(k));
  if (matches.length >= 2) {
    score -= 40;
    threats.push("Phishing URL pattern detected");
  }

  // clamp
  score = Math.max(score, 0);

  const riskLevel =
    score >= 70 ? "safe" :
    score >= 30 ? "suspicious" :
    "dangerous";

  // breakdown
  const breakdown = {
    ssl: data.hasSSL ? 20 : 0,
    scripts: data.suspiciousKeywords.length > 0 ? 10 : 20,
    forms: data.passwordFormsWithoutSSL ? 0 : 20,
    cookies: data.cookieCount > 5 ? 10 : 20,
    phishing: data.iframeCount > 2 ? 10 : 20,
  };

  return {
    trustScore: score,
    riskLevel,
    breakdown,
    detectedThreats: threats,
  };
};