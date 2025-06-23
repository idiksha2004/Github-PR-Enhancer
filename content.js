function extractDiffFromPage() {
  const diffTables = document.querySelectorAll('.js-file-content');

  let fullDiff = "";

  diffTables.forEach(table => {
    const fileHeader = table.closest('.file').querySelector('.file-info')?.innerText || "Unknown File";
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

  button.onclick = async () => {
    output.innerText = "⏳ Extracting diff...";
    const diff = extractDiffFromPage();

    if (!diff) {
      output.innerText = "⚠️ No code diff found.";
      return;
    }

    const prompt = `
You're a senior software engineer reviewing a pull request.

Here is the code diff from a GitHub PR:

${diff}

Summarize the purpose of this PR. Highlight what was added, removed, or changed. Keep it clear and technical, under 200 words.
`;

    output.innerText = "🤖 Sending to GPT...";

    const apiKey = ""; // 🔐 Replace this with your actual API key

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful code reviewer." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5
        })
      });

      const data = await response.json();
      console.log("Full response from OpenAI:", data);

      const summary = data.choices?.[0]?.message?.content || "❌ No response from API.";
      output.innerText = "🧠 Summary:\n\n" + summary;
    } catch (err) {
      output.innerText = "🚨 Error calling GPT API:\n" + err.message;
    }
  };

  target.appendChild(button);
  target.appendChild(output);
}

window.addEventListener('load', injectEnhancerUI);
