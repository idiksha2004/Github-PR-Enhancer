chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "summarizeWithLLM") {
    console.log("📡 Proxy call triggered with:", request.prompt);

    fetch("http://localhost:1234/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi",
        prompt: request.prompt,
        stream: false
      })
    })
    .then(res => res.text())
    .then(raw => {
      console.log("📩 Raw response from proxy:", raw);

      if (!raw) return sendResponse({ error: "Ollama returned an empty response." });

      let data;
      try {
        data = JSON.parse(raw);
        const summary = data.response || data.capital || data.summary || "(No usable field in response)";
        sendResponse({ summary });
      } catch (err) {
        sendResponse({ error: "Failed to parse response: " + err.message + "\nRaw: " + raw });
      }
    })
    .catch(err => {
      sendResponse({ error: "Proxy fetch error: " + err.message });
    });

    return true; // Required for async sendResponse
  }
});