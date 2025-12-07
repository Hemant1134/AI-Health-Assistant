const { sendChatPrompt } = require("../utils/ai");

const ALLOWED_FIELDS = [
  "name", "age", "gender", "city",
  "chronic_conditions", "allergies", "emergency_contact"
];

// ===================== MAIN FLOW ===================== //
module.exports = async function symptomAgent(text, state = {}) {
  state.step ||= "symptom";
  state.asked ||= [];
  state.symptoms ||= [];
  state.answers ||= {};
  state.personal ||= {};
  state.completed = !!state.completed;
  state.personalFormGenerated = !!state.personalFormGenerated;

  const t = (text || "").toLowerCase().trim();
  const askOnce = (key) => !state.asked.includes(key) && state.asked.push(key);

  // 🚫 If completed earlier, don't re-ask anything
  if (state.completed && state.personalFormGenerated) {
    return {
      type: "done",
      reply: "🎉 Your profile is complete!",
      options: ["Start new chat", "Book Appointment"],
      update: state
    };
  }

  // 🟦 ASK FIRST QUESTION
  if (!state.asked.includes("main_symptom")) {
    askOnce("main_symptom");
    return {
      type: "message",
      reply: "Hi, I'm your health assistant 👨‍⚕️ What is your main symptom?",
      options: [
        "Fever","Cough","Cold","Headache",
        "Stomach pain","Body pain","Breathing issue","Other"
      ],
      update: state
    };
  }

  // 🟧 CAPTURE + DETECT MAIN SYMPTOM
  if (!state.symptoms.length && t) {
    let detected = detectSymptom(t);

    // 🧠 If unknown, ask AI
    if (!detected) {
      const guess = await askAIForSymptom(t);
      detected = guess || "other";
    }

    // ⚠️ If STILL unknown → ask again
    if (detected === "unknown" || detected === null) {
      return {
        type: "message",
        reply:
          `Got it, you’re feeling **"${text}"**, but I’m not fully sure.\n` +
          `Can you describe your main symptom in simple words?\n\n` +
          `Examples: Fever, headache, stomach pain, cough, etc.`,
        options: ["Fever","Cold","Cough","Headache","Stomach pain","Body pain","Breathing issue","Other"],
        update: state
      };
    }

    state.symptoms.push(detected);
    state.answers[detected] ||= {};
  }

  const main = state.symptoms[0];

  // ===================== FEVER FLOW ===================== //
  if (main === "fever") {
    const fever = state.answers.fever || {};

    if (!state.asked.includes("fever_duration")) {
      askOnce("fever_duration");
      return {
        type: "message",
        reply: "How long have you had fever?",
        options: ["< 24 hours","1–3 days","> 3 days","Not sure"],
        update: state
      };
    }
    if (!fever.duration && t) fever.duration = text;

    if (!state.asked.includes("fever_temp")) {
      askOnce("fever_temp");
      return {
        type: "message",
        reply: "Highest recorded temperature?",
        options: ["< 99°F","99–100.9°F","101–102°F","> 102°F","Not measured"],
        update: state
      };
    }
    if (!fever.temperature && t) fever.temperature = text;

    if (!state.asked.includes("fever_meds")) {
      askOnce("fever_meds");
      return {
        type: "message",
        reply: "Did you take medicine?",
        options: ["Yes, helped","Yes, no improvement","No"],
        update: state
      };
    }
    if (!fever.meds && t) fever.meds = text;

    state.answers.fever = fever;
  }

  // 😶 GENERIC OTHER SYMPTOMS (Works for ANY symptom)
  if (!state.asked.includes("other_symptoms")) {
    askOnce("other_symptoms");
    return {
      type: "message",
      reply: "Any other symptoms?",
      options: ["Cold","Cough","Headache","Body pain","Breathing issue","No"],
      update: state
    };
  }
  if (!state.answers.otherSymptoms && t) {
    state.answers.otherSymptoms = t.startsWith("no") ? "none" : text;
  }

  // 📄 PERSONAL FORM GENERATION
  if (!state.personalFormGenerated) {
    state.personalFormGenerated = true;
    state.step = "personal";
    const form = await generatePersonalForm(state);
    state.personalForm = form;
    return {
      type: "form",
      reply: "Please fill your personal details 👇",
      form,
      update: state
    };
  }

  return {
    type: "message",
    reply: "Please fill your personal details to continue.",
    update: state
  };
};

// ===================== HELPERS ===================== //

async function generatePersonalForm(state) {
  const defaultFields = ["name", "age", "gender", "city"];
  if (!process.env.GEMINI_API_KEY) return buildForm(defaultFields);

  try {
    const system = `
Select personal fields from whitelist ONLY:
${ALLOWED_FIELDS.join(", ")}
Return pure JSON ONLY as: {"fields":[{"name":"name","required":true}]}
No comments or text.
`.trim();

    const user = JSON.stringify({ symptoms: state.symptoms, answers: state.answers });
    const raw = await sendChatPrompt(system, user);
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
    const valid = parsed.fields.filter(f => ALLOWED_FIELDS.includes(f.name));

    return valid.length ? buildForm(valid.map(f => f.name), valid) : buildForm(defaultFields);
  } catch {
    return buildForm(defaultFields);
  }
}

function buildForm(names, raw) {
  return {
    title: "Patient Details",
    fields: names.map(name => {
      const base = raw?.find(f => f.name === name) || {};
      return {
        name,
        label: label(name),
        type: type(name),
        required: base.required !== false,
        ...(name === "gender" ? { options: ["Male","Female","Other"] } : {})
      };
    })
  };
}

const label = (n) => ({
  name: "Full Name",
  age: "Age",
  gender: "Gender",
  city: "City",
  chronic_conditions: "Chronic Conditions",
  allergies: "Allergies",
  emergency_contact: "Emergency Contact"
}[n] || n);

const type = (n) => ({ age: "number", gender: "select" }[n] || "text");

function detectSymptom(t) {
  if (t.includes("fever")) return "fever";
  if (/[cold|sneeze|runny]/i.test(t)) return "cold";
  if (t.includes("cough")) return "cough";
  if (t.includes("head")) return "headache";
  if (/[stomach|vomit]/i.test(t)) return "stomach_pain";
  if (/[body|muscle]/i.test(t)) return "body_pain";
  if (/[breath]/i.test(t)) return "breathing_issue";
  return null; // 🚫 Unknown → force AI fallback
}

async function askAIForSymptom(userMessage) {
  try {
    const prompt = `
User said: "${userMessage}"

Identify ONE general symptom:
["fever","cough","cold","headache","stomach_pain","body_pain","breathing_issue","other"]

Respond with ONLY the word. No sentence.
`;
    const raw = await sendChatPrompt(prompt);
    return raw?.toLowerCase().trim();
  } catch {
    return "other";
  }
}
