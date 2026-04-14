import { By } from "selenium-webdriver";
import type { DriverType } from "./driver";
import type { PageScanData } from "../types/scan.types";
import logger from "../config/logger";

export async function analyzePage(
  driver: DriverType,
  url: string
): Promise<PageScanData> {
  await driver.get(url);

  // Give SPA/React time to render and simulate a bit of user behavior
  await driver.sleep(1500);
  await driver.executeScript(
    "window.scrollTo(0, document.body.scrollHeight * 0.4);"
  );
  await driver.sleep(700);

  const currentUrl = await driver.getCurrentUrl();
  const title = await driver.getTitle();
  const hasSSL = currentUrl.startsWith("https://");

  const scriptElements = await driver.findElements(By.tagName("script"));
  const externalScripts: string[] = [];
  const suspiciousKeywords: string[] = [];
  const jsKeywords = ["eval(", "document.write(", "atob("];

  for (const script of scriptElements) {
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
  }

  const inputs = await driver.findElements(By.css('input[type="password"]'));
  const hasPasswordForm = inputs.length > 0;

  const iframes = await driver.findElements(By.tagName("iframe"));
  const iframeCount = iframes.length;

  const hiddenElements = await driver.findElements(
    By.css('[style*="display:none"], [style*="visibility:hidden"]')
  );
  const hiddenElementsCount = hiddenElements.length;

  logger.info(
    `🔍 Analyzed ${currentUrl} - Title: "${title}", SSL: ${hasSSL}, External Scripts: ${externalScripts.length}, Suspicious Keywords: ${suspiciousKeywords.length}, Password Forms: ${hasPasswordForm}, Iframes: ${iframeCount}, Hidden Elements: ${hiddenElementsCount}`
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
  };
}