const { sendChatPrompt } = require("../utils/ai");

/**
 * state shape:
 * { asked:[], answers:{}, symptoms:[], personal:{}, step, completed }
 */
module.exports = async function symptomAgent(text, state = {}) {
  state.asked = Array.isArray(state.asked) ? state.asked : [];
  state.answers = state.answers || {};
  state.symptoms = Array.isArray(state.symptoms) ? state.symptoms : [];
  state.personal = state.personal || {};
  state.step = state.step || "greeting";

  const t = (text || "").toLowerCase().trim();

  // helper
  const pushAsked = (q) => { if (!state.asked.includes(q)) state.asked.push(q); };

  // STEP: greeting -> ask main symptom
  if (!state.asked.includes("main_symptom")) {
    pushAsked("main_symptom");
    return {
      type: "message",
      reply: "Hi — I'm your health assistant. What is your main symptom?",
      options: ["Fever", "Cough", "Cold", "Headache", "Stomach Pain", "Other"],
      update: state
    };
  }

  // detect symptom if user typed it or selected option
  if (!state.symptoms.length) {
    const detected = detectSymptom(t);
    if (detected) {
      state.symptoms.push(detected);
      state.answers[detected] = {};
    } else if (t && t !== "other") {
      state.symptoms.push("other");
      state.answers.other = { description: text };
    }
  }

  const main = state.symptoms[0];

  // FEVER FLOW
  if (main === "fever") {
    // duration
    if (!state.asked.includes("fever_duration")) {
      pushAsked("fever_duration");
      return {
        type: "message",
        reply: "How long have you had the fever?",
        options: ["<24 hours", "1–3 days", ">3 days", "Not sure"],
        update: state
      };
    }
    if (!state.answers.fever.duration && t) {
      state.answers.fever.duration = text;
    }

    // temperature
    if (!state.asked.includes("fever_temperature")) {
      pushAsked("fever_temperature");
      return {
        type: "message",
        reply: "What is the highest temperature you recorded (°F)?",
        options: ["<99°F", "99–100.9°F", "101–102°F", ">102°F", "I don't know"],
        update: state
      };
    }
    if (!state.answers.fever.temperature && t) {
      state.answers.fever.temperature = text;
    }

    // meds
    if (!state.asked.includes("fever_meds")) {
      pushAsked("fever_meds");
      return {
        type: "message",
        reply: "Have you taken any medication for the fever?",
        options: ["Yes, it helped", "Yes, no improvement", "No"],
        update: state
      };
    }
    if (!state.answers.fever.meds && t) {
      state.answers.fever.meds = text;
    }

    // other symptoms once only
    if (!state.asked.includes("other_symptoms")) {
      pushAsked("other_symptoms");
      return {
        type: "message",
        reply: "Do you have any other symptoms?",
        options: ["Cold/runny nose", "Cough", "Shortness of breath", "Loss of smell/taste", "No"],
        update: state
      };
    }
    if (!state.answers.otherSymptoms && t) {
      state.answers.otherSymptoms = text;
      if (t === "no" || t === "no other symptoms" || t === "none") {
        state.answers.otherSymptoms = "none";
      }
    }

    // after collecting fever details -> ask personal details (only once)
    if (!state.asked.includes("name")) {
      pushAsked("name");
      return { type: "message", reply: "May I have your full name?", update: state };
    }
    if (!state.personal.name && t) state.personal.name = text;

    if (!state.asked.includes("age")) {
      pushAsked("age");
      return { type: "message", reply: "What is your age?", update: state };
    }
    if (!state.personal.age && t) state.personal.age = text;

    if (!state.asked.includes("gender")) {
      pushAsked("gender");
      return { type: "message", reply: "What is your gender?", options: ["Male", "Female", "Other"], update: state };
    }
    if (!state.personal.gender && t) state.personal.gender = text;

    // ready to complete
    state.completed = true;

    // Optionally let Gemini summarize the case (non-blocking if Gemini config missing)
    let summary = `Collected: symptom=fever, duration=${state.answers.fever.duration || ""}, temp=${state.answers.fever.temperature || ""}`;
    try {
      if (process.env.GEMINI_API_KEY) {
        const system = `You are a medical assistant. Create a 1-line summary for the clinician of the patient's condition using only plain text.`;
        const textPrompt = `Patient: ${JSON.stringify(state)}`;
        const s = await sendChatPrompt(system, textPrompt);
        if (s && s.length < 500) summary = s.trim();
      }
    } catch (e) {
      console.warn("Gemini summarization failed:", e.message);
    }

    return {
      type: "message",
      reply: `Thanks — I have captured the details. ${summary}`,
      options: ["Show profile", "Book appointment", "Finish"],
      update: state
    };
  }

  // FALLBACK generic flow for other symptoms or 'other'
  // Ask "other symptom details" if not asked
  if (!state.asked.includes("other_desc")) {
    pushAsked("other_desc");
    return { type: "message", reply: "Please describe the symptom in brief.", update: state };
  }
  if (!state.answers.other && t) {
    state.answers.other = text;
  }

  // then personal details same as above
  if (!state.asked.includes("name")) {
    pushAsked("name");
    return { type: "message", reply: "May I have your full name?", update: state };
  }
  if (!state.personal.name && t) state.personal.name = text;

  if (!state.asked.includes("age")) {
    pushAsked("age");
    return { type: "message", reply: "What is your age?", update: state };
  }
  if (!state.personal.age && t) state.personal.age = text;

  state.completed = true;
  return { type: "message", reply: "Thank you — profile completed.", options: ["Show profile", "Book appointment"], update: state };
};

function detectSymptom(t) {
  if (!t) return null;
  if (t.includes("fever")) return "fever";
  if (t.includes("cough")) return "cough";
  if (t.includes("cold") || t.includes("runny") || t.includes("sneeze")) return "cold";
  if (t.includes("headache")) return "headache";
  if (t.includes("stomach") || t.includes("vomit")) return "stomach";
  return null;
}
