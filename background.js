chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "summarizeWithLLM") {
    fetch("http://localhost:1234/ollama", ...)
, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi", // or tinyllama, mistral, etc
        prompt: request.prompt,
        stream: false
      })
    })
      .then(res => {
        console.log("✅ LLM status:", res.status);
        return res.text(); // even if it's empty or broken
      })
      .then(raw => {
        console.log("🔍 Raw Ollama response:", raw);

        if (!raw) {
          sendResponse({ error: "Ollama returned an empty response." });
          return;
        }

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          sendResponse({
            error: "Failed to parse LLM response: " + err.message + "\nRaw: " + raw
          });
          return;
        }

        const summary =
          data.response || data.capital || data.summary || "(no usable field in response)";
        sendResponse({ summary });
      })
      .catch(err => {
        sendResponse({ error: "Fetch error: " + err.message });
      });

    return true;
  }
});
