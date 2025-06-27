const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/ollama', async (req, res) => {
  console.log("🟡 Proxy received request:", req.body);

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const result = await ollamaResponse.text();
    console.log("🟢 Ollama raw response:", result);

    res.send(result);
  } catch (err) {
    console.error("🔴 Proxy error:", err);
    res.status(500).send({ error: "Failed to contact Ollama" });
  }
});

app.listen(1234, () => console.log("✅ Proxy running at http://localhost:1234"));
