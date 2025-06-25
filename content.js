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

  const target = document.querySelector('.gh-header-meta');
  if (!target) return;

  const button = document.createElement('button');
  button.innerText = "🧠 AI Summarize PR";
  button.id = "ai-pr-enhancer";
  button.className = "btn btn-primary";
  button.style.marginTop = "10px";

  const output = document.createElement('div');
  output.id = "ai-summary-output";
  output.style.marginTop = "15px";
  output.style.whiteSpace = "pre-wrap";

  button.onclick = async () => {
    output.innerText = "⏳ Extracting diff...";
    const diff = extractDiffFromPage();

    if (!diff) {
      output.innerText = "⚠️ No code diff found.";
      return;
    }

    const prompt = `
You are a helpful code reviewer. Summarize this GitHub pull request diff:

${diff}

Highlight changes made, the purpose, and any possible issues or improvements. Keep the response under 200 words.
    `.trim();

    output.innerText = "🤖 Asking local LLM (phi)...";

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "phi",
          prompt: prompt,
          stream: false
        })
      });

      const data = await response.json();
      const summary = data.response || "❌ No response from local LLM.";
      output.innerText = "🧠 Summary:\n\n" + summary;

    } catch (err) {
      output.innerText = "🚨 Error contacting local LLM:\n" + err.message;
    }
  };

  target.appendChild(button);
  target.appendChild(output);
}

window.addEventListener('load', injectEnhancerUI);
