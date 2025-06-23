function extractDiffFromPage() {
  const lines = document.querySelectorAll('.blob-code-addition, .blob-code-deletion');
  let diff = "";

  lines.forEach((line) => {
    const sign = line.classList.contains('blob-code-addition') ? '+' : '-';
    diff += sign + ' ' + line.innerText + '\n';
  });

  return diff.trim();
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

    const apiKey = "YOUR_OPENAI_API_KEY_HERE"; // 🔐 Replace this with your actual API key

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful code reviewer." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5
        })
      });

      const data = await response.json();
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
