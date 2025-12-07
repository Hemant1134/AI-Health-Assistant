const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is missing. aiDoctorAgent will not work properly.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const model = genAI.getGenerativeModel({ model: modelName });

/**
 * Friendly family-doctor style AI.
 * - No diagnosis
 * - No medicine dose
 * - Only guidance + next questions
 */
async function aiDoctorFollowup(userText, state) {
  // Build a compact context from state
  const context = {
    mainSymptom: state.answers?.mainSymptom || null,
    otherSymptoms: state.answers?.otherSymptoms || null,
    duration: state.answers?.duration || null,
    temperature: state.answers?.temperature || null,
    meds: state.answers?.meds || null,
    riskLevel: state.riskLevel || null,
    personal: state.personal || null,
  };

  const prompt = `
You are a **friendly family doctor AI**.
User is chatting in a simple medical triage system.

Rules:
- Be warm, polite and human, but concise.
- Do NOT give a diagnosis.
- Do NOT give exact medicine doses, brand names, or prescriptions.
- You may suggest *generic* self-care like "drink fluids", "rest", "see a doctor if worse".
- Always remind: this is not a replacement for a doctor visit.
- Keep tone: calm, reassuring, like a family doctor talking.

User's latest message:
${userText}

Known context (JSON):
${JSON.stringify(context, null, 2)}

You must respond in **pure JSON** with this shape:

{
  "reply": "string - what you say next to the user (max ~80-100 words, friendly)",
  "next_options": ["optional array of quick reply options, or empty array"],
  "emergency": {
    "flag": true/false,
    "level": "low" | "moderate" | "high",
    "reason": "short reason if flag=true",
    "action": "short safe guidance, e.g. 'If you feel very unwell, please see a nearby doctor or emergency department immediately.'"
  }
}

Emergency logic:
- Only set "flag": true if symptoms clearly suggest serious concern like:
  - severe chest pain, difficulty breathing, confusion, fainting, uncontrolled bleeding, very high fever with severe symptoms, etc.
- Even when emergency is true, do NOT say "you are having X disease".
- Say "this could be serious, please seek urgent medical care" style.

Output ONLY JSON. No backticks, no explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("aiDoctorAgent JSON parse error:", err, text);
      // fallback generic message
      return {
        reply:
          "I understand your concern. I’ll ask you a few more questions to understand your symptoms better. " +
          "Remember, this chat is for guidance only and not a replacement for a real doctor.",
        options: [],
        emergency: null,
      };
    }

    return {
      reply: data.reply || 
        "Thanks for sharing. I’ll ask you a few more questions so we can understand your symptoms better.",
      options: Array.isArray(data.next_options) ? data.next_options : [],
      emergency: data.emergency || null,
    };
  } catch (err) {
    console.error("aiDoctorAgent error:", err);
    return {
      reply:
        "Sorry, I’m having trouble thinking right now. Please try again after a moment or contact a real doctor if you feel unwell.",
      options: [],
      emergency: null,
    };
  }
}

module.exports = aiDoctorFollowup;
