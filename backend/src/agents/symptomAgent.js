const { sendChatPrompt } = require("../utils/ai");

// Allowed personal fields for Option A
const ALLOWED_FIELDS = [
  "name",
  "age",
  "gender",
  "city",
  "chronic_conditions",
  "allergies",
  "emergency_contact"
];

/**
 * Symptom agent:
 * - Handles symptom intake
 * - Drives state machine
 * - Triggers AI-generated personal form
 */
module.exports = async function symptomAgent(text, state = {}) {
  state.step = state.step || "symptom";
  state.asked = Array.isArray(state.asked) ? state.asked : [];
  state.symptoms = Array.isArray(state.symptoms) ? state.symptoms : [];
  state.answers = state.answers || {};
  state.personal = state.personal || {};
  state.completed = !!state.completed;
  state.personalFormGenerated = !!state.personalFormGenerated;

  const t = (text || "").toLowerCase().trim();

  const askOnce = (key) => {
    if (!state.asked.includes(key)) state.asked.push(key);
  };

  // STEP 1: main symptom
  if (!state.asked.includes("main_symptom")) {
    askOnce("main_symptom");
    return {
      type: "message",
      reply: "Hi — I'm your health assistant. What is your main symptom?",
      options: [
        "Fever",
        "Cough",
        "Cold",
        "Headache",
        "Stomach pain",
        "Body pain",
        "Breathing issue",
        "Other"
      ],
      update: state
    };
  }

  // Detect main symptom if none yet
  if (!state.symptoms.length && t) {
    const detected = detectSymptom(t);
    state.symptoms.push(detected);
    state.answers[detected] = state.answers[detected] || {};
  }

  const main = state.symptoms[0];

  // --- FEVER FLOW EXAMPLE ---
  if (main === "fever") {
    const feverAns = state.answers.fever || {};

    // duration
    if (!state.asked.includes("fever_duration")) {
      askOnce("fever_duration");
      return {
        type: "message",
        reply: "How long have you had the fever?",
        options: ["< 24 hours", "1–3 days", "> 3 days", "Not sure"],
        update: state
      };
    }
    if (!feverAns.duration && t && !isBotQuestion("fever_duration", state)) {
      feverAns.duration = text;
    }

    // temperature
    if (!state.asked.includes("fever_temperature")) {
      askOnce("fever_temperature");
      state.answers.fever = feverAns;
      return {
        type: "message",
        reply: "What is your highest recorded temperature?",
        options: [
          "< 99°F",
          "99–100.9°F",
          "101–102°F",
          "> 102°F",
          "Not measured"
        ],
        update: state
      };
    }
    if (!feverAns.temperature && t && !isBotQuestion("fever_temperature", state)) {
      feverAns.temperature = text;
    }

    // medication
    if (!state.asked.includes("fever_meds")) {
      askOnce("fever_meds");
      state.answers.fever = feverAns;
      return {
        type: "message",
        reply: "Have you taken any medication for the fever?",
        options: ["Yes, and it helped", "Yes, no improvement", "No"],
        update: state
      };
    }
    if (!feverAns.meds && t && !isBotQuestion("fever_meds", state)) {
      feverAns.meds = text;
    }

    state.answers.fever = feverAns;
  }

  // --- GENERIC OTHER SYMPTOMS QUESTION (once) ---
  if (!state.asked.includes("other_symptoms")) {
    askOnce("other_symptoms");
    return {
      type: "message",
      reply: "Do you have any other symptoms?",
      options: [
        "Cold",
        "Cough",
        "Headache",
        "Body pain",
        "Breathing issue",
        "No"
      ],
      update: state
    };
  }

  if (!state.answers.otherSymptoms && t && !isBotQuestion("other_symptoms", state)) {
    state.answers.otherSymptoms = t.startsWith("no") ? "none" : text;
  }

  // At this point, we assume symptom intake is done → move to personal
  if (!state.personalFormGenerated) {
    state.personalFormGenerated = true;
    state.step = "personal";

    // ask AI which personal fields we need
    const form = await generatePersonalForm(state);
    state.personalForm = form;

    return {
      type: "form",
      reply: "To complete your health profile, please fill these details.",
      form,
      update: state
    };
  }

  // fallback
  return {
    type: "message",
    reply: "Thanks, I’ve recorded your symptoms. Please fill your details to continue.",
    update: state
  };
};

/**
 * Use Gemini to choose which personal fields to ask from whitelist ALLOWED_FIELDS.
 * If Gemini fails, fallback to name+age+gender+city.
 */
async function generatePersonalForm(state) {
  const fallbackFields = ["name", "age", "gender", "city"];

  if (!process.env.GEMINI_API_KEY) {
    return buildFormFromFieldNames(fallbackFields);
  }

  try {
    const systemPrompt = `
You are helping design a patient intake form for a clinic.
You must choose which personal fields are required based on symptoms and risk.
You can ONLY choose from this whitelist (do not invent new fields):
${ALLOWED_FIELDS.join(", ")}

Rules:
- For mild fever or cold: ask at least name, age, gender.
- For breathing issue or stomach pain: also ask emergency_contact.
- You may also include chronic_conditions or allergies if relevant.
- NEVER ask for phone, email, ID numbers, address, or any field outside the whitelist.
Return ONLY valid JSON like:
{"fields":[{"name":"name","required":true},{"name":"age","required":true}]}.
No extra keys, no comments, no text outside JSON.
    `.trim();

    const userPrompt = `State: ${JSON.stringify({
      symptoms: state.symptoms,
      answers: state.answers
    })}`;

    const raw = await sendChatPrompt(systemPrompt, userPrompt);
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/m);
      if (m) parsed = JSON.parse(m[0]);
    }

    if (!parsed || !Array.isArray(parsed.fields) || parsed.fields.length === 0) {
      return buildFormFromFieldNames(fallbackFields);
    }

    // filter only allowed fields
    const selected = parsed.fields
      .map((f) => f.name)
      .filter((name) => ALLOWED_FIELDS.includes(name));

    if (!selected.length) {
      return buildFormFromFieldNames(fallbackFields);
    }

    return buildFormFromFieldNames(selected, parsed.fields);
  } catch (err) {
    console.warn("generatePersonalForm error:", err.message);
    return buildFormFromFieldNames(fallbackFields);
  }
}

/**
 * Build a form schema from names.
 */
function buildFormFromFieldNames(names, rawFields) {
  const fields = names.map((name) => {
    const base = rawFields?.find((f) => f.name === name) || {};
    const required = base.required !== undefined ? !!base.required : true;
    const label = labelFor(name);
    const type = typeFor(name);
    const options = name === "gender" ? ["Male", "Female", "Other"] : undefined;

    return { name, label, type, required, ...(options ? { options } : {}) };
  });

  return {
    title: "Patient Details",
    fields
  };
}

function labelFor(name) {
  switch (name) {
    case "name":
      return "Full Name";
    case "age":
      return "Age";
    case "gender":
      return "Gender";
    case "city":
      return "City";
    case "chronic_conditions":
      return "Chronic Conditions (if any)";
    case "allergies":
      return "Allergies (if any)";
    case "emergency_contact":
      return "Emergency Contact";
    default:
      return name;
  }
}

function typeFor(name) {
  switch (name) {
    case "age":
      return "number";
    case "gender":
      return "select";
    default:
      return "text";
  }
}

function detectSymptom(t) {
  if (!t) return "other";
  if (t.includes("fever")) return "fever";
  if (t.includes("cold") || t.includes("runny") || t.includes("sneeze"))
    return "cold";
  if (t.includes("cough")) return "cough";
  if (t.includes("head")) return "headache";
  if (t.includes("stomach") || t.includes("vomit")) return "stomach_pain";
  if (t.includes("body") || t.includes("muscle")) return "body_pain";
  if (t.includes("breath")) return "breathing_issue";
  return "other";
}

// very simple placeholder; we’re not using previous-question-text check deeply here
function isBotQuestion(_key, _state) {
  return false;
}
