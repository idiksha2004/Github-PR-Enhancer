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
    .then(res => res.json())
    .then(data => {
      sendResponse({ summary: data.response });
    })
    .catch(err => {
      sendResponse({ error: err.message });
    });

    // Return true to signal async response
    return true;
  }
});
