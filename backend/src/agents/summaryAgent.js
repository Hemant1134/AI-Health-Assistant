const { sendChatPrompt } = require("../utils/ai");

module.exports = async function summaryAgent(state = {}) {
  const p = state.personal || {};
  const a = state.answers || {};
  const s = state.symptoms || [];

  let summary = `Patient ${p.name}, age ${p.age}, main symptom: ${s[0]}.`;
  if (a.fever) summary += ` Fever since ${a.fever.duration}, max temp ${a.fever.temperature}, meds ${a.fever.meds}.`;
  if (a.otherSymptoms && a.otherSymptoms !== "none") summary += ` Other symptoms: ${a.otherSymptoms}.`;

  let risk = "mild";
  if (a.fever?.temperature?.includes("102")) risk = "moderate";

  if (process.env.GEMINI_API_KEY) {
    try {
      const sys = `Summarize patient in 1 line, no diagnosis, no treatment.`;
      const usr = JSON.stringify({ p, a, s });
      const txt = await sendChatPrompt(sys, usr);
      if (txt) summary = txt.trim();
    } catch {}
  }
  return { summary, riskLevel: risk };
};
