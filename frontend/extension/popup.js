document.getElementById("scanBtn").addEventListener("click", () => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "SCAN" },
            (response) => {

                if (!response) {
                    document.getElementById("result").innerText = "Error scanning";
                    return;
                }

                document.getElementById("result").innerHTML = `
                    <p><b>Title:</b> ${response.title}</p>
                    <p><b>HTTPS:</b> ${response.isHTTPS}</p>
                    <p><b>Forms:</b> ${response.forms}</p>
                    <p><b>Inputs:</b> ${response.inputs}</p>
                `;
            }
        );

    });

});