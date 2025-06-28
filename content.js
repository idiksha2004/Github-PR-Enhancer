console.log("✅ GitHub PR Enhancer content script loaded");

function extractDiffFromPage() {
  const diffTables = document.querySelectorAll('.js-file-content');
  let fullDiff = "";

  diffTables.forEach(table => {
    const fileHeader = table.closest('.file')?.querySelector('.file-info')?.innerText || "Unknown File";
    fullDiff += `\n\nFile: ${fileHeader}\n`;

    const addedLines = table.querySelectorAll('.blob-code-addition');
    const removedLines = table.querySelectorAll('.blob-code-deletion');

    addedLines.forEach(line => {
      const text = line.innerText.trim();
      if (text) fullDiff += `+ ${text}\n`;
    });

    removedLines.forEach(line => {
      const text = line.innerText.trim();
      if (text) fullDiff += `- ${text}\n`;
    });
  });

  return fullDiff.trim();
}

function injectEnhancerUI() {
  const existing = document.getElementById('ai-pr-enhancer');
  if (existing) return;

  const target = document.querySelector('.gh-header-actions');
  if (!target) {
    console.warn("❌ Could not find injection point on page.");
    return;
  }

  const button = document.createElement('button');
  button.innerText = "🧠 AI Summarize PR";
  button.id = "ai-pr-enhancer";
  button.style.cssText = "margin:8px;padding:6px 12px;background:#2c974b;color:white;border:none;border-radius:6px;cursor:pointer;";

  const output = document.createElement('div');
  output.id = "ai-summary-output";
  output.style.cssText = "margin-top:15px;white-space:pre-wrap;";

  button.onclick = async () => {
    output.innerText = "⏳ Extracting diff...";
    const fullDiff = extractDiffFromPage();
    const limitedDiff = fullDiff.slice(0, 2000); // Avoid crashing small LLMs

    if (!limitedDiff) {
      output.innerText = "⚠️ No code diff found.";
      return;
    }

    const prompt = `
You are a helpful code reviewer. Summarize the following GitHub pull request diff:

${limitedDiff}

Write a short summary (1–3 sentences) in plain English. Output only the summary.
`.trim();

    output.innerText = "🤖 Asking local LLM...";

    chrome.runtime.sendMessage({
      type: "summarizeWithLLM",
      prompt
    }, (response) => {
      if (response?.error) {
        output.innerText = "🚨 Error contacting local LLM:\n" + response.error;
      } else {
        output.innerText = "🧠 Summary:\n\n" + response.summary;
      }
    });
  };

  target.appendChild(button);
  target.parentNode.insertBefore(output, target.nextSibling);
}

window.addEventListener('load', injectEnhancerUI);