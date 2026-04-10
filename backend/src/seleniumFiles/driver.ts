import "chromedriver";
import {
  Builder,
  Browser,
  WebDriver,
} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome"; 
import logger from "../config/logger";

export type DriverType = WebDriver;

let driverInstance: DriverType | null = null;

export async function getDriver(): Promise<DriverType> {
  if (!driverInstance) {
    const options = new chrome.Options()
      .addArguments(
        "--disable-blink-features=AutomationControlled",
        "--window-size=1400,900"
      )
      .addArguments(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146 Safari/537.36"
      );

    const rawDriver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options as chrome.Options)   
      .build();

    await rawDriver.manage().setTimeouts({
      pageLoad: 15000,
      script: 10000,
    });

    driverInstance = rawDriver;
  }
  logger.info("🚀 Selenium WebDriver initialized");
  return driverInstance;
}

export async function closeDriver(): Promise<void> {
  if (driverInstance) {
    await driverInstance.quit();
    driverInstance = null;
  }
}