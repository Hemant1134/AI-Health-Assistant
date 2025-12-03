require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not provided — AI features will be disabled.");
}

let model = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  model = genAI.getGenerativeModel({ model: modelName });
}

async function sendChatPrompt(systemPrompt, userPrompt) {
  if (!model) throw new Error("Gemini model not configured");
  const prompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
  const result = await model.generateContent({ prompt: [{ text: prompt }] });
  const response = await result.response;
  // response.text() helper
  if (response && response.text) {
    const text = await response.text();
    return text;
  }
  // Fallback examine candidates
  const out = result?.response?.candidates?.[0]?.content;
  return typeof out === "string" ? out : JSON.stringify(out || "");
}

function tryParseJSON(text) {
  try { return JSON.parse(text); } catch (e) {
    const m = text && text.match(/\{[\s\S]*\}/m);
    if (m) {
      try { return JSON.parse(m[0]); } catch (e2) { return null; }
    }
    return null;
  }
}

module.exports = { sendChatPrompt, tryParseJSON };
