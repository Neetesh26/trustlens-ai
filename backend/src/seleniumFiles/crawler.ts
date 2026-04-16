import { By, until } from "selenium-webdriver";
import type { DriverType } from "./driver";
import { analyzePage } from "./analyzer";
import type { PageScanData } from "../types/scan.types";
import logger from "../config/logger";

// ✅ UPDATED: Added wait + scroll (no logic change)
async function getLinksOnPage(
  driver: DriverType,
  url: string
): Promise<string[]> {
  await driver.get(url);

  // ✅ Wait for full page load
  await driver.wait(async () => {
    const state = await driver.executeScript("return document.readyState");
    return state === "complete";
  }, 15000);

  // ✅ Wait for links to appear
  await driver.wait(
    until.elementsLocated(By.tagName("a")),
    15000
  );

  // ✅ Scroll to load lazy content
  await driver.executeScript(
    "window.scrollTo(0, document.body.scrollHeight)"
  );

  // small delay for dynamic rendering
  await driver.sleep(2000);

  const elements = await driver.findElements(By.tagName("a"));
  const links: string[] = [];

  for (const el of elements) {
    try {
      const href = await el.getAttribute("href");

      // ✅ basic filtering (no structure change)
      if (
        href &&
        !href.startsWith("javascript:") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("#")
      ) {
        links.push(href);
      }
    } catch {
      continue;
    }
  }

  return links;
}

function filterInternalLinks(baseUrl: string, links: string[]): string[] {
  const baseHost = new URL(baseUrl).hostname;

  return links
    .map((link) => {
      try {
        return new URL(link, baseUrl).toString();
      } catch {
        return "";
      }
    })
    .filter((link) => {
      if (!link) return false;
      try {
        const host = new URL(link).hostname;
        return host === baseHost;
      } catch {
        return false;
      }
    });
}

export interface SeleniumScanResult {
  startUrl: string;
  pages: PageScanData[];
}

export async function crawlAndScanSite(
  driver: DriverType,
  startUrl: string,
  maxPages = 25
): Promise<SeleniumScanResult> {
  const visited = new Set<string>();
  const queue: string[] = [startUrl];
  const pages: PageScanData[] = [];

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;

    visited.add(url);
    console.log("🔍 Selenium scanning:", url);

    try {
      const pageData = await analyzePage(driver, url);
      pages.push(pageData);

      // ✅ uses improved function internally
      const links = await getLinksOnPage(driver, url);
      const internal = filterInternalLinks(startUrl, links);

      for (const link of internal) {
        if (!visited.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
    } catch (e: any) {
      console.error("Page scan failed:", url, e.message);
    }
  }

  logger.info(
    `✅ Completed crawl. Visited ${visited.size} pages starting from ${startUrl}`
  );

  return { startUrl, pages };
}