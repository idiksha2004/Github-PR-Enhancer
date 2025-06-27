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
.then(res => res.text()) // << CHANGED
.then(raw => {
  console.log("🧪 Raw response from Ollama:", raw);
  let data;
  try {
    data = JSON.parse(raw);
    sendResponse({ summary: data.response || "(empty response)" });
  } catch (err) {
    sendResponse({ error: "Failed to parse LLM response: " + err.message + "\nRaw: " + raw });
  }
})
.catch(err => {
  sendResponse({ error: err.message });
});


    // Return true to signal async response
    return true;
  }
});
