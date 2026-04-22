const API_BASE = "http://localhost:8080/api/v1";
const PUBLIC_SCAN_PATH = `${API_BASE}/scan/public-analyze`;

function notifyScanComplete(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/notification.svg"),
    title: "TrustLens AI Scan Complete",
    message,
  });
}

function queryActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve(tabs && tabs[0]);
    });
  });
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      resolve(response);
    });
  });
}

async function fetchSeleniumReport(url) {
  const response = await fetch(PUBLIC_SCAN_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Scan failed with status ${response.status}`);
  }

  return payload.data.report;
}

function getNotificationText(url, seleniumResult) {
  const host = url;
  const riskLevel = seleniumResult?.riskLevel || "Unknown";
  const trackers = seleniumResult?.rawData?.trackers?.length ?? 0;
  const pagesScanned = seleniumResult?.rawData?.pages?.length ?? 0;
  return `${host} scan complete. Risk: ${riskLevel}, Trackers: ${trackers}, Pages: ${pagesScanned}`;
}

async function performBackgroundScan(url) {
  const result = {
    local: null,
    selenium: null,
  };

  try {
    const activeTab = await queryActiveTab();
    if (activeTab && typeof activeTab.id === "number") {
      result.local = await sendMessageToTab(activeTab.id, { type: "SCAN" });
    }
  } catch (error) {
    result.local = { error: error.message || "Local scan failed" };
  }

  try {
    result.selenium = await fetchSeleniumReport(url);
  } catch (error) {
    result.selenium = { error: error.message || "Selenium scan failed" };
  }

  const message = getNotificationText(url, result.selenium);
  notifyScanComplete(message);

  chrome.runtime.sendMessage({
    type: "SCAN_COMPLETE",
    payload: result,
  });

  return result;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("TrustLens AI Installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "START_SCAN") {
    return;
  }

  performBackgroundScan(message.url)
    .then((result) => {
      sendResponse({ success: true, result });
    })
    .catch((error) => {
      sendResponse({ success: false, error: error.message || "Scan failed" });
    });

  return true;
});
