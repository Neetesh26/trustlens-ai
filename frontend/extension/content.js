function analyzePage() {
    return {
        title: document.title,
        url: location.href,
        isHTTPS: location.protocol === "https:",
        forms: document.querySelectorAll("form").length,
        inputs: document.querySelectorAll("input").length,
        scripts: document.querySelectorAll("script").length
    };
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "SCAN") {
        sendResponse(analyzePage());
    }
});