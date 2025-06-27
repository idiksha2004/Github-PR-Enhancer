const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/ollama', async (req, res) => {
  const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  const result = await ollamaResponse.text(); // send raw result back
  res.send(result);
});

app.listen(1234, () => console.log("Proxy running at http://localhost:1234"));
