import axios from "axios";
import * as cheerio from "cheerio";

export interface RawScanData {
  url: string;
  finalUrl: string;
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

export const scanWebsite = async (inputUrl: string): Promise<RawScanData> => {
  // ✅ normalize URL
  const url = inputUrl.startsWith("http")
    ? inputUrl
    : `http://${inputUrl}`;

  const result: RawScanData = {
    url,
    finalUrl: url,
    hasSSL: false,
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
    const res = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    // ✅ detect final URL after redirect
    const finalUrl =
      res.request?.res?.responseUrl || url;

    result.finalUrl = finalUrl;

    // ✅ REAL SSL CHECK
    result.hasSSL = finalUrl.startsWith("https://");

    // ✅ redirect count
    result.redirects = finalUrl !== url ? 1 : 0;

    const html = typeof res.data === "string" ? res.data : "";
    const $ = cheerio.load(html);

    // external scripts
    $("script[src]").each((_, el) => {
      const src = $(el).attr("src") || "";
      result.externalScripts.push(src);
    });

    // suspicious JS
    const keywords = ["eval(", "document.write(", "atob("];
    $("script").each((_, el) => {
      const code = $(el).html() || "";
      keywords.forEach((k) => {
        if (code.includes(k)) result.suspiciousKeywords.push(k);
      });
    });

    // password form check
    const hasPassword = $('input[type="password"]').length > 0;
    result.passwordFormsWithoutSSL = hasPassword && !result.hasSSL;

    // iframe
    result.iframeCount = $("iframe").length;

    // hidden elements
    result.hiddenElements = $(
      '[style*="display:none"], [style*="visibility:hidden"]'
    ).length;

    // cookies
    const cookies = res.headers["set-cookie"];
    result.cookieCount = Array.isArray(cookies) ? cookies.length : 0;

  } catch (err: any) {
    console.log("Scan failed:", err.message);
  }

  return result;
};