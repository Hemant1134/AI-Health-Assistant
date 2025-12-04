const { GoogleGenerativeAI } = require("@google/generative-ai");

let model = null;

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠ GEMINI_API_KEY not set. AI-based features will be limited.");
} else {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  model = genAI.getGenerativeModel({ model: modelName });
}

/**
 * Send a prompt to Gemini and get a text response.
 */
async function sendChatPrompt(systemPrompt, userPrompt) {
  if (!model) throw new Error("Gemini model not configured");

  const prompt = `${systemPrompt}\n\nUser: ${userPrompt}`;

  const result = await model.generateContent(prompt);
  const resp = result.response;

  if (resp && typeof resp.text === "function") {
    return await resp.text();
  }

  return JSON.stringify(resp || "");
}

module.exports = { sendChatPrompt };
