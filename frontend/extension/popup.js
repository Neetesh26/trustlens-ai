const scanBtn = document.getElementById("scanBtn");
const pasteBtn = document.getElementById("pasteBtn");
const resultEl = document.getElementById("result");
const urlInput = document.getElementById("urlInput");
const API_BASE = "http://localhost:8080/api/v1";

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
  if (!items || items.length === 0) {
    return `
      <div class="list-block">
        <h3>${title}</h3>
        <p class="hint">No items detected.</p>
      </div>
    `;
  }

  return `
    <div class="list-block">
      <h3>${title}</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

async function scanUrl(url) {
  try {
    setStatus("Running Selenium scan... this may take 15-40 seconds.");

    const response = await fetch(`${API_BASE}/scan/public-analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || "Scan failed.");
    }

    const report = payload.data.report;
    const rawData = report.rawData || {};
    const pages = rawData.pages || [];
    const phishingDetected = pages.some((page) => page.isPhishingRisk) || rawData.passwordFormsWithoutSSL;
    const trackerCount = rawData.trackers?.length ?? 0;
    const suspiciousCount = rawData.suspiciousKeywords?.length ?? 0;
    const threatLabels = report.detectedThreats || [];

    setResult(`
      <div class="result-header">
        <div>
          <h2>${new URL(report.url).hostname}</h2>
          <p class="hint">Trust score ${report.trustScore} • ${report.riskLevel}</p>
        </div>
      </div>
      <div class="result-grid">
        ${renderMetric("Phishing Risk", phishingDetected ? "High" : "Low")}
        ${renderMetric("Tracker count", trackerCount)}
        ${renderMetric("Suspicious scripts", suspiciousCount)}
        ${renderMetric("Pages scanned", pages.length)}</div>
      ${renderList("Detected trackers", rawData.trackers)}
      ${renderList("Suspicious keywords", rawData.suspiciousKeywords)}
      ${renderList("Detected threats", threatLabels.length ? threatLabels : ["None detected"])}
      ${report.aiSummary ? `<div class="list-block"><h3>AI summary</h3><p>${report.aiSummary}</p></div>` : ""}
    `);
  } catch (error) {
    setStatus(error.message || "Unable to complete scan.", "negative");
  }
}

function loadActiveTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].url) {
      return;
    }

    const activeUrl = tabs[0].url;
    urlInput.value = activeUrl;
  });
}

pasteBtn.addEventListener("click", loadActiveTabUrl);

scanBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (!url) {
    setStatus("Please enter a valid URL.", "negative");
    return;
  }

  scanUrl(url.startsWith("http") ? url : `https://${url}`);
});

loadActiveTabUrl();
