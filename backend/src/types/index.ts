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

export interface ScanResult {
  url: string;
  trustScore: number;         // 0-100
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  breakdown: RiskBreakdown;
  aiSummary: string;
  detectedThreats: string[];
  scannedAt: Date;
}

export type UserRole = 'free' | 'pro' | 'admin';