const scanBtn = document.getElementById("scanBtn");
const pasteBtn = document.getElementById("pasteBtn");
const resultEl = document.getElementById("result");
const urlInput = document.getElementById("urlInput");
const STORAGE_KEY = "lastScanResult";

function setResult(html) {
  resultEl.innerHTML = html;
}

function setStatus(message, style = "") {
  setResult(`<div class="status ${style}">${message}</div>`);
}

function renderMetric(label, value) {
  return `<div class="metric"><strong>${label}</strong><span>${value}</span></div>`;
}

function renderList(title, items) {
  const listItems = items && items.length ? items : ["None detected"];
  return `
    <div class="list-block">
      <h3>${title}</h3>
      <ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function saveScanResultToStorage(scanResult) {
  chrome.storage.local.set({
    [STORAGE_KEY]: {
      result: scanResult,
      timestamp: new Date().toISOString(),
    },
  });
}

function loadScanResultFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (items) => {
      resolve(items[STORAGE_KEY] || null);
    });
  });
}

function renderScanResult({ local, selenium }, isStored = false) {
  const localContent = local?.error
    ? `<p class="hint">Local scan failed: ${local.error}</p>`
    : `
      <div class="list-block">
        <h3>Local scan</h3>
        <ul>
          <li><strong>Title:</strong> ${local?.title || "N/A"}</li>
          <li><strong>HTTPS:</strong> ${local?.isHTTPS ? "Yes" : "No"}</li>
          <li><strong>Forms:</strong> ${local?.forms ?? 0}</li>
          <li><strong>Inputs:</strong> ${local?.inputs ?? 0}</li>
          <li><strong>Scripts:</strong> ${local?.scripts ?? 0}</li>
        </ul>
      </div>
    `;

  const seleniumContent = selenium?.error
    ? `<p class="hint">Selenium scan failed: ${selenium.error}</p>`
    : `
      <div class="result-header">
        <div>
          <h2>${new URL(selenium.url || urlInput.value).hostname}</h2>
          <p class="hint">Trust score ${selenium.trustScore ?? "N/A"} • ${selenium.riskLevel ?? "N/A"}</p>
        </div>
      </div>
      <div class="result-grid">
        ${renderMetric("Trackers", selenium.rawData?.trackers?.length ?? 0)}
        ${renderMetric("Suspicious", selenium.rawData?.suspiciousKeywords?.length ?? 0)}
        ${renderMetric("Pages scanned", selenium.rawData?.pages?.length ?? 0)}
        ${renderMetric("Password risk", selenium.rawData?.passwordFormsWithoutSSL ? "Yes" : "No")}
      </div>
      ${renderList("Detected trackers", selenium.rawData?.trackers || [])}
      ${renderList("Suspicious keywords", selenium.rawData?.suspiciousKeywords || [])}
      ${renderList("Detected threats", selenium.detectedThreats || [])}
      ${selenium.aiSummary ? `<div class="list-block"><h3>AI summary</h3><p>${selenium.aiSummary}</p></div>` : ""}
    `;

  const storedBadge = isStored
    ? `<div class="status positive">📦 Stored result - Scan again for fresh data</div>`
    : "";

  setResult(`
    ${storedBadge}
    ${localContent}
    ${seleniumContent}
  `);
}

function startBackgroundScan() {
  const url = urlInput.value.trim();
  if (!url) {
    setStatus("Please enter a valid URL.", "negative");
    return;
  }

  const scanUrl = url.startsWith("http") ? url : `https://${url}`;
  setStatus("Scan started in background. A notification will appear when complete.");

  chrome.runtime.sendMessage({ type: "START_SCAN", url: scanUrl }, (response) => {
    if (chrome.runtime.lastError) {
      setStatus(chrome.runtime.lastError.message, "negative");
      return;
    }

    if (!response?.success) {
      setStatus(response?.error || "Scan could not be started.", "negative");
      return;
    }

    if (response.result) {
      saveScanResultToStorage(response.result);
      renderScanResult(response.result, false);
    }
  });
}

function loadActiveTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].url) {
      return;
    }

    urlInput.value = tabs[0].url;
  });
}

async function loadPreviousResults() {
  const stored = await loadScanResultFromStorage();
  if (stored && stored.result) {
    renderScanResult(stored.result, true);
    if (stored.timestamp) {
      const date = new Date(stored.timestamp);
      const timeStr = date.toLocaleString();
      const hint = document.querySelector(".hint");
      if (hint) {
        hint.innerHTML += ` (Last scan: ${timeStr})`;
      }
    }
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "SCAN_COMPLETE") {
    saveScanResultToStorage(message.payload);
    renderScanResult(message.payload, false);
  }
});

pasteBtn.addEventListener("click", loadActiveTabUrl);
scanBtn.addEventListener("click", startBackgroundScan);

const clearBtn = document.getElementById("clearBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.remove([STORAGE_KEY], () => {
      setResult(`<p class="hint">Scan results cleared. Enter a URL and scan to get fresh results.</p>`);
    });
  });
}

loadActiveTabUrl();
loadPreviousResults();
