import { RawScanData } from './scan.service';
import { RiskBreakdown } from '../types';

export interface ScoreResult {
  trustScore: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  breakdown: RiskBreakdown;
  detectedThreats: string[];
}

export const calculateTrustScore = (data: RawScanData): ScoreResult => {
  let ssl = 20;
  let scripts = 20;
  let forms = 20;
  let cookies = 20;
  let phishing = 20;

  const threats: string[] = [];

  // SSL scoring (0–20)
  if (!data.hasSSL) {
    ssl = 0;
    threats.push('No SSL/TLS encryption detected');
  }

  // Scripts scoring (0–20)
  const suspiciousCount = data.suspiciousKeywords.length;
  if (suspiciousCount > 3) { scripts = 0; threats.push('Multiple suspicious JavaScript patterns found'); }
  else if (suspiciousCount > 0) { scripts = 10; threats.push('Suspicious JavaScript patterns detected'); }

  if (data.trackers.length > 3) {
    scripts = Math.min(scripts, 10);
    threats.push(`${data.trackers.length} tracking scripts detected`);
  }

  // Forms scoring (0–20)
  if (data.passwordFormsWithoutSSL) {
    forms = 0;
    threats.push('Password field detected on HTTP (non-secure) page');
  }

  // Cookies scoring (0–20)
  if (data.cookieCount > 10) { cookies = 5; threats.push('Excessive cookie usage'); }
  else if (data.cookieCount > 5) { cookies = 15; }

  // Phishing indicators (0–20)
  if (data.iframeCount > 3) {
    phishing -= 8;
    threats.push('Multiple iframes detected (clickjacking risk)');
  }
  if (data.hiddenElements > 5) {
    phishing -= 7;
    threats.push('Suspicious hidden elements detected');
  }
  if (data.redirects > 2) {
    phishing -= 5;
    threats.push('Multiple redirects detected');
  }
  phishing = Math.max(0, phishing);

  const trustScore = ssl + scripts + forms + cookies + phishing;

  const riskLevel =
    trustScore >= 70 ? 'safe' :
    trustScore >= 30 ? 'suspicious' :
    'dangerous';

  return {
    trustScore,
    riskLevel,
    breakdown: { ssl, scripts, forms, cookies, phishing },
    detectedThreats: threats,
  };
};