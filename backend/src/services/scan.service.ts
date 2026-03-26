import axios from 'axios';
import * as cheerio from 'cheerio';
// import { logger } from '../config/logger';

export interface RawScanData {
  url: string;
  hasSSL: boolean;
  externalScripts: string[];
  suspiciousKeywords: string[];
  passwordFormsWithoutSSL: boolean;
  trackers: string[];
  cookieCount: number;
  iframeCount: number;
  hiddenElements: number;
  redirects: number;
}

// Known tracker domains
const TRACKER_DOMAINS = [
  'doubleclick.net', 'google-analytics.com', 'facebook.net',
  'hotjar.com', 'mixpanel.com', 'segment.io',
];

// Suspicious JS keywords
const SUSPICIOUS_KEYWORDS = [
  'eval(', 'document.write(', 'unescape(', 'fromCharCode',
  'atob(', 'crypto.subtle', 'navigator.credentials',
];

export const scanWebsite = async (url: string): Promise<RawScanData> => {
  const result: RawScanData = {
    url,
    hasSSL: url.startsWith('https://'),
    externalScripts: [],
    suspiciousKeywords: [],
    passwordFormsWithoutSSL: false,
    trackers: [],
    cookieCount: 0,
    iframeCount: 0,
    hiddenElements: 0,
    redirects: 0,
  };

  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
      headers: {
        'User-Agent': 'TrustLens-Scanner/1.0 (security-analysis)',
      },
      validateStatus: () => true, // Don't throw on non-2xx
    });

    result.redirects = response.request?.res?.responseUrl !== url ? 1 : 0;

    const $ = cheerio.load(response.data as string);

    // Analyze external scripts
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src') || '';
      if (src.startsWith('http') || src.startsWith('//')) {
        result.externalScripts.push(src);
        TRACKER_DOMAINS.forEach((tracker) => {
          if (src.includes(tracker)) result.trackers.push(tracker);
        });
      }
    });

    // Check inline scripts for suspicious patterns
    $('script:not([src])').each((_, el) => {
      const code = $(el).html() || '';
      SUSPICIOUS_KEYWORDS.forEach((kw) => {
        if (code.includes(kw)) result.suspiciousKeywords.push(kw);
      });
    });

    // Detect password forms without SSL
    const hasPasswordField = $('input[type="password"]').length > 0;
    result.passwordFormsWithoutSSL = hasPasswordField && !result.hasSSL;

    // Count iframes (often used for clickjacking)
    result.iframeCount = $('iframe').length;

    // Hidden elements (potential phishing trick)
    result.hiddenElements = $('[style*="display:none"], [style*="visibility:hidden"]').length;

    // Cookie count from headers
    const setCookieHeader = response.headers['set-cookie'];
    result.cookieCount = Array.isArray(setCookieHeader) ? setCookieHeader.length : 0;

  } catch (error) {
    // logger.warn(`Scan failed for ${url}:`, error);
    console.log("scan failed");
    
    // Return partial data, don't throw — AI will assess with what we have
  }

  return result;
};