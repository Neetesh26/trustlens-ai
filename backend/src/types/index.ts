import { Request } from 'express';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'free' | 'pro' | 'admin';
  };
}

// Trust score breakdown
export interface RiskBreakdown {
  ssl: number;          // 0-20
  scripts: number;      // 0-20
  forms: number;        // 0-20
  cookies: number;      // 0-20
  phishing: number;     // 0-20
}

export interface ScoreResult {
  trustScore: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  breakdown: {
    ssl: number;
    scripts: number;
    forms: number;
    cookies: number;
    phishing: number;
  };
  detectedThreats: string[];
}

export type UserRole = 'free' | 'pro' | 'admin';