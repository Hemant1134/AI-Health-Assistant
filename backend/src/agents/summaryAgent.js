const { sendChatPrompt } = require("../utils/ai");

/**
 * summaryAgent(state)
 * Creates a clinical-style summary and risk level.
 */
module.exports = async function summaryAgent(state = {}) {
  const personal = state.personal || {};
  const answers = state.answers || {};
  const symptoms = state.symptoms || [];

  let summary = `Patient ${personal.name || ""}, age ${personal.age || "N/A"}, main symptom: ${symptoms[0] || "N/A"}.`;

  if (answers.fever) {
    summary += ` Fever for ${answers.fever.duration || "unknown duration"}, highest temp ${answers.fever.temperature || "unknown"}, meds: ${answers.fever.meds || "N/A"}.`;
  }

  if (answers.otherSymptoms && answers.otherSymptoms !== "none") {
    summary += ` Additional symptoms: ${answers.otherSymptoms}.`;
  }

  // Basic risk logic
  let risk = "mild";

  if (answers.fever && answers.fever.temperature) {
    const t = answers.fever.temperature;
    if (/101–102|101-102|101–102°F|101-102°F/i.test(t)) {
      risk = "moderate";
    }
    if (/> 102|> 102°F|>102|>102°F|102–103|102-103/i.test(t)) {
      risk = "moderate";
    }
  }

  if (symptoms.includes("breathing_issue")) {
    risk = "moderate";
  }

  // Try to refine with Gemini if available
  if (process.env.GEMINI_API_KEY) {
    try {
      const sys = `
You are a medical assistant. Summarize the patient's condition in 1–2 short sentences.
No diagnosis, no treatment, just a neutral clinical description.
Use plain text, no bullet points.
      `.trim();

      const usr = `State: ${JSON.stringify({ personal, answers, symptoms })}`;
      const txt = await sendChatPrompt(sys, usr);
      if (txt && txt.length < 600) summary = txt.trim();
    } catch (e) {
      console.warn("Summary Gemini error:", e.message);
    }
  }

  return { summary, riskLevel: risk };
};
