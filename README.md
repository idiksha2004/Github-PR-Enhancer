# 🧠 GitHub PR Enhancer

A Chrome extension that uses AI to **summarize GitHub pull requests**, estimate **risk levels**, and provide **smart checklists** — all injected directly into the PR UI. Powered by GPT or open-source models like Mistral.

<p align="center">
  <img src="https://img.shields.io/badge/built_with-JavaScript-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/API-OpenAI%2FTogether.ai%2FGroq-green?style=flat-square" />
  <img src="https://img.shields.io/badge/manifest-v3-yellow?style=flat-square" />
</p>

---

## ✨ Features

* 🔍 **AI-generated summaries** of PR diffs using GPT-4o or Mistral
* ⚠️ **Risk level analysis** based on files, changes, and diff size *(WIP)*
* ✅ **Smart review checklist** (tests, dependencies, coverage) *(Coming soon)*
* 💡 Injected directly into GitHub's “Files changed” tab
* 🔌 Supports OpenAI, Groq, and Together.ai API backends
* 💬 Clean, responsive UI styled in-place

---

## 📸 Demo

> Coming Soon: GIF demo here

---

## 💪 Tech Stack

* Chrome Extension (Manifest v3)
* JavaScript + DOM injection
* OpenAI / Together.ai / Groq APIs
* Optional: TailwindCSS (inline)

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/github-pr-enhancer.git
cd github-pr-enhancer
```

### 2. Add your API Key

Open `content.js` and update:

```js
const apiKey = "sk-..."            // For OpenAI
// OR
const apiKey = "your_groq_key";    // For Groq
// OR
const apiKey = "your_together_key"; // For Together.ai
```

Also update the `fetch()` URL and model as needed:

```js
// For OpenAI
https://api.openai.com/v1/chat/completions

// For Together.ai
https://api.together.xyz/v1/chat/completions

// For Groq
https://api.groq.com/openai/v1/chat/completions
```

---

### 3. Load the Extension in Chrome

* Open `chrome://extensions`
* Enable **Developer Mode**
* Click **Load Unpacked**
* Select the `github-pr-enhancer/` folder

---

## 💻 How It Works

1. When viewing the **“Files changed”** tab of a GitHub PR, the extension:

   * Injects a 🧠 **AI Summarize PR** button
   * Extracts all added/removed lines from the PR diff
   * Builds a summarization prompt
   * Calls the selected AI model via API
   * Injects the response back into the GitHub UI

2. (Coming Soon)

   * Risk estimation based on folder names, test files, and schema updates
   * Checklists and auto-comments

---

## 🛆 Models Supported

| Model                      | Provider    | Notes                       |
| -------------------------- | ----------- | --------------------------- |
| `gpt-3.5-turbo` / `gpt-4o` | OpenAI      | Great accuracy              |
| `mixtral-8x7b`             | Groq        | Blazing fast, free          |
| `mistral-7b-instruct`      | Together.ai | Fully open-source           |
| `llama3-8b/70b`            | Together.ai | Great for reasoning *(WIP)* |

---

## 🧰 Roadmap

* [x] Summarization using GPT
* [x] PR Diff Parser
* [ ] Risk analyzer module
* [ ] Smart checklist generator
* [ ] Popup settings UI (API key, model)
* [ ] Deploy to Chrome Web Store

---

## 🙌 Contributing

PRs are welcome! Feel free to fork and improve:

* Use cases like PR comment suggestions
* Integrate with GitHub API for auto-labeling
* Style improvements or animations

---

## 📜 License

[MIT](LICENSE)

---

## ✉️ Contact

Built with 💻 by [Your Name](https://github.com/idiksha2004)

