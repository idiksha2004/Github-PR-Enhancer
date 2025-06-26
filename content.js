chrome.runtime.sendMessage({
  type: "summarizeWithLLM",
  prompt: prompt
}, (response) => {
  if (response?.error) {
    output.innerText = "🚨 Error contacting local LLM:\n" + response.error;
  } else {
    output.innerText = "🧠 Summary:\n\n" + response.summary;
  }
});
