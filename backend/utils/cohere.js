const { CohereClientV2 } = require("cohere-ai");

const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

const MODEL = "command-r-plus-08-2024";

async function chat(message, systemPrompt) {
  const response = await cohere.chat({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const content = response?.message?.content;
  if (Array.isArray(content)) {
    return content.map((c) => c.text || "").join("\n").trim();
  }
  return (content || "").toString().trim();
}

module.exports = { chat };
