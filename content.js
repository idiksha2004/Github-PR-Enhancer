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
    console.warn("❌ Could not find PR header to inject button.");
    return;
  }

  const button = document.createElement('button');
  button.innerText = "🧠 AI Summarize PR";
  button.id = "ai-pr-enhancer";
  button.style.margin = "8px";
  button.style.padding = "6px 12px";
  button.style.background = "#2c974b";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";

  const output = document.createElement('div');
  output.id = "ai-summary-output";
  output.style.marginTop = "15px";
  output.style.whiteSpace = "pre-wrap";

  button.onclick = async () => {
    output.innerText = "⏳ Extracting diff...";
    const fullDiff = extractDiffFromPage();

    if (!fullDiff) {
      output.innerText = "⚠️ No code diff found.";
      return;
    }

    const limitedDiff = fullDiff.slice(0, 2000); // Truncate to 2000 characters

    const prompt = `
You are a helpful code reviewer. Summarize this GitHub pull request diff:

${limitedDiff}

Highlight the purpose and any important changes in under 150 words.
    `.trim();

    output.innerText = "🤖 Asking local LLM...";

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
  };

  target.appendChild(button);
  target.parentNode.insertBefore(output, target.nextSibling);
}

window.addEventListener('load', injectEnhancerUI);
