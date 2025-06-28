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

      if (!raw) {
        sendResponse({ error: "Ollama returned an empty response." });
        return;
      }

      // ✅ Just send the raw response directly (assuming plain text)
      sendResponse({ summary: raw });
    })
    .catch(err => {
      sendResponse({ error: "Proxy fetch error: " + err.message });
    });

    return true; // Keeps sendResponse alive asynchronously
  }
});
