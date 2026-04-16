export interface PageScanData {
  url: string;
  title: string;
  hasSSL: boolean;
  externalScripts: string[];
  suspiciousKeywords: string[];
  hasPasswordForm: boolean;
  iframeCount: number;
  hiddenElements: number;
  trackers: string[];
externalDomains: string[];
isPhishingRisk: boolean;
isClickjackingRisk: boolean;
}

export interface RawScanData {
  startUrl: string;
  finalUrl: string;
  url: string;
  pages: PageScanData[];
  hasSSL: boolean;
  externalScripts: string[];
  suspiciousKeywords: string[];
  passwordFormsWithoutSSL: boolean;
  trackers: string[];
  iframeCount: number;
  hiddenElements: number;
  cookieCount: number;
  redirects: number;
}
