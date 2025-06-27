chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "summarizeWithLLM") {
    fetch("http://localhost:11434/api/generate", {
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
      console.log("🔍 Raw response from LLM:", raw);
      try {
        const data = JSON.parse(raw);

        // Try multiple fallback fields
        const summary = data.response || data.capital || JSON.stringify(data, null, 2);

        sendResponse({ summary });
      } catch (err) {
        sendResponse({ error: "Failed to parse LLM response: " + err.message + "\nRaw: " + raw });
      }
    })
    .catch(err => {
      sendResponse({ error: err.message });
    });

    return true;
  }
});
