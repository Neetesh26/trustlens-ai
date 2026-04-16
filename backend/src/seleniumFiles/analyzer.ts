import { By, until } from "selenium-webdriver";
import type { DriverType } from "./driver";
import type { PageScanData } from "../types/scan.types";
import logger from "../config/logger";

export async function analyzePage(
  driver: DriverType,
  url: string
): Promise<PageScanData> {
  await driver.get(url);

  // ✅ Wait for full page load
  await driver.wait(async () => {
    const state = await driver.executeScript("return document.readyState");
    return state === "complete";
  }, 15000);

  await driver.wait(until.elementLocated(By.css("body")), 10000);

  // ✅ Simulate user scroll
  await driver.executeScript(
    "window.scrollTo(0, document.body.scrollHeight * 0.4);"
  );
  await driver.sleep(1000);

  const currentUrl = await driver.getCurrentUrl();
  const title = await driver.getTitle();
  const hasSSL = currentUrl.startsWith("https://");

  // =========================
  // 🔥 SCRIPT ANALYSIS
  // =========================
  const scriptElements = await driver.findElements(By.tagName("script"));
  const externalScripts: string[] = [];
  const suspiciousKeywords: string[] = [];
  const jsKeywords = ["eval(", "document.write(", "atob("];

  for (const script of scriptElements) {
    try {
      const src = await script.getAttribute("src");

      if (src) {
        externalScripts.push(src);
      } else {
        const code = (await script.getAttribute("innerHTML")) || "";

        for (const k of jsKeywords) {
          if (code.includes(k) && !suspiciousKeywords.includes(k)) {
            suspiciousKeywords.push(k);
          }
        }
      }
    } catch {
      continue;
    }
  }

  // =========================
  // 🔥 TRACKER DETECTION
  // =========================
  const knownTrackers = [
    "google-analytics.com",
    "googletagmanager.com",
    "facebook.net",
    "hotjar.com"
  ];

  const trackers: string[] = [];

  for (const script of externalScripts) {
    for (const tracker of knownTrackers) {
      if (script.includes(tracker) && !trackers.includes(tracker)) {
        trackers.push(tracker);
      }
    }
  }

  // =========================
  // 🔥 EXTERNAL DOMAIN ANALYSIS
  // =========================
  const externalDomains = externalScripts
    .map((src) => {
      try {
        return new URL(src).hostname;
      } catch {
        return "";
      }
    })
    .filter(Boolean);

  // =========================
  // 🔐 PASSWORD FORM DETECTION
  // =========================
  const inputs = await driver.findElements(By.css('input[type="password"]'));
  const hasPasswordForm = inputs.length > 0;

  // =========================
  // 🧱 IFRAME ANALYSIS
  // =========================
  const iframes = await driver.findElements(By.tagName("iframe"));
  const iframeCount = iframes.length;

  // =========================
  // 👁️ HIDDEN ELEMENTS
  // =========================
  const hiddenElements = await driver.findElements(
    By.css('[style*="display:none"], [style*="visibility:hidden"]')
  );
  const hiddenElementsCount = hiddenElements.length;

  // =========================
  // ⚠️ RISK DETECTION
  // =========================
  const isPhishingRisk = hasPasswordForm && !hasSSL;
  const isClickjackingRisk = iframeCount > 3;

  logger.info(
    `🔍 Analyzed ${currentUrl}
    Title: "${title}"
    SSL: ${hasSSL}
    Scripts: ${externalScripts.length}
    Trackers: ${trackers.length}
    Suspicious JS: ${suspiciousKeywords.length}
    Password Form: ${hasPasswordForm}
    Iframes: ${iframeCount}
    Hidden Elements: ${hiddenElementsCount}
    Phishing Risk: ${isPhishingRisk}
    Clickjacking Risk: ${isClickjackingRisk}`
  );

  return {
    url: currentUrl,
    title,
    hasSSL,
    externalScripts,
    suspiciousKeywords,
    hasPasswordForm,
    iframeCount,
    hiddenElements: hiddenElementsCount,

    // 🚀 ADVANCED DATA
    trackers,
    externalDomains,
    isPhishingRisk,
    isClickjackingRisk
  };
}