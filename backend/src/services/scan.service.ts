import type { RawScanData } from "../types/scan.types";
import { getDriver, closeDriver } from "../seleniumFiles/driver";
import { crawlAndScanSite, SeleniumScanResult } from "../seleniumFiles/crawler";

function summarizeScanResult(result: SeleniumScanResult): RawScanData {
  const hasSSL = result.pages.some((page) => page.hasSSL);

  const externalScripts = Array.from(
    new Set(result.pages.flatMap((page) => page.externalScripts))
  );

  const suspiciousKeywords = Array.from(
    new Set(result.pages.flatMap((page) => page.suspiciousKeywords))
  );

  const iframeCount = result.pages.reduce(
    (sum, page) => sum + page.iframeCount,
    0
  );

  const hiddenElements = result.pages.reduce(
    (sum, page) => sum + page.hiddenElements,
    0
  );

  const passwordFormsWithoutSSL =
    result.pages.some((page) => page.hasPasswordForm) && !hasSSL;

  const trackers = Array.from(
    new Set(result.pages.flatMap((page) => page.trackers))
  );

  const finalUrl =
    result.pages.length > 0
      ? result.pages[result.pages.length - 1].url
      : result.startUrl;

  return {
    url: result.startUrl,
    finalUrl,
    hasSSL,
    externalScripts,
    suspiciousKeywords,
    passwordFormsWithoutSSL,
    trackers,
    iframeCount,
    hiddenElements,
    cookieCount: 0,
    redirects: 0,
    startUrl: result.startUrl,
    pages: result.pages,
  };
}

export async function scanWebsite(url: string): Promise<RawScanData> {
  const driver = await getDriver();
  try {
    const result = await crawlAndScanSite(driver, url);
    return summarizeScanResult(result);
  } finally {
    await closeDriver();
  }
}