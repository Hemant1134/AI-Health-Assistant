// backend/src/controllers/chat.controller.js (or similar path)

const { getState, saveState } = require("../utils/state");
const { normalizeResponse } = require("../utils/validation");
const symptomAgent = require("../agents/symptomAgent");
const summaryAgent = require("../agents/summaryAgent");
const appointmentAgent = require("../agents/appointmentAgent");
const { buildAdvice } = require("../utils/advice");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

// ✅ NEW – smart AI fallback
const aiDoctorFollowup = require("../agents/aiDoctorAgent");

const SAFE_FIELDS = [
  "name",
  "age",
  "gender",
  "city",
  "chronic_conditions",
  "allergies",
  "emergency_contact",
];

// static options we already show on “Start new chat”
const KNOWN_MAIN_SYMPTOMS = [
  "fever",
  "cough",
  "cold",
  "headache",
  "stomach pain",
  "body pain",
  "breathing issue",
  "other",
];


// 🔍 Detect common greetings
const isGreeting = (text = "") => {
  const greetings = [
    "hi", "hello", "hey", "yo", "hola", "good morning",
    "good evening", "good night", "namaste", "sup"
  ];

  const cleaned = text.toLowerCase().trim();
  return greetings.some((g) => cleaned.startsWith(g));
};

exports.handleChat = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const { message } = req.body;

    let state = (await getState(sessionId)) || {};
    const text = (message || "").toString().trim();

    state.symptoms = state.symptoms || [];
    state.answers = state.answers || {};
    state.personal = state.personal || {};

    // Reset on greeting (if last session was completed or partially stored)
    if ((!state || Object.keys(state).length === 0) || isGreeting(message)) {
      state = {
        step: "symptom",
        asked: [],
        symptoms: [],
        answers: {},
        personal: {},
        completed: false,
        personalFormGenerated: false,
      };
      await saveState(sessionId, state);
    }

     // NEW: Greeting Handler
    if (isGreeting(text)) {
      return res.json({
        reply: "👋 Hello! I’m here to help your health. What symptom or problem are you facing?",
        type: "message",
        options: [
          "Fever",
          "Cough",
          "Cold",
          "Headache",
          "Stomach pain",
          "Body pain",
          "Breathing issue",
          "Something else"
        ]
      });
    }

    // Restart
    if (message === "Start new chat") {
      state = {};
      await saveState(sessionId, state);
      return res.json({
        type: "message",
        reply: "🔄 New chat started. What is your main symptom?",
        options: [
          "Fever",
          "Cough",
          "Cold",
          "Headache",
          "Stomach pain",
          "Body pain",
          "Breathing issue",
          "Other",
        ],
      });
    }

    // Appointment view
    if (message === "Book Appointment" && state.recommendation) {
      const a = state.recommendation;
      return res.json({
        type: "message",
        reply:
          `📅 Appointment suggestion:\n` +
          `🏥 Department: ${a.department}\n` +
          `👨‍⚕️ Doctor: ${a.doctor}\n` +
          `⏰ ${a.date} at ${a.time}`,
        options: ["Start new chat"],
      });
    }

    // If profile already complete, don't rerun symptom flow
    if (state.profileComplete && typeof message === "string") {
      return res.json({
        type: "done",
        reply: "🎉 Your profile is complete!",
        options: ["Start new chat", "Book Appointment"],
      });
    }

    // ===========================
    // 🔹 FORM SUBMISSION (personal details)
    // ===========================
    if (message && typeof message === "object" && !Array.isArray(message)) {
      const cleaned = {};
      for (const key of SAFE_FIELDS) {
        if (message[key] !== undefined && message[key] !== "") {
          cleaned[key] = String(message[key]);
        }
      }

      state.personal = cleaned;
      state.completed = true;
      state.profileComplete = true;

      // Summary + appointment
      const summaryRes = await summaryAgent(state);
      state.summary = summaryRes.summary;
      state.riskLevel = summaryRes.riskLevel;

      const apptRes = await appointmentAgent(state);
      state.recommendation = apptRes;

      // Advice
      const advice = buildAdvice(state);
      state.advice = advice;

      // Persist in Mongo (history)
      const patientDoc = await Patient.create({
        sessionId,
        personal: state.personal,
        symptoms: state.answers,
        summary: state.summary,
        riskLevel: state.riskLevel,
      });

      await Appointment.create({
        patientId: patientDoc._id,
        department: apptRes.department,
        doctor: apptRes.doctor,
        date: apptRes.date,
        time: apptRes.time,
        status: "Pending",
        meta: { ...apptRes, advice },
      });

      await saveState(sessionId, state);

      const reply =
        `❤️ Thanks ${state.personal.name || ""}\n` +
        `📝 Summary: ${state.summary}\n` +
        `⚠️ Risk: ${state.riskLevel.toUpperCase()}\n` +
        `🏥 Department: ${apptRes.department}\n` +
        `⏰ Suggested time: ${apptRes.date} at ${apptRes.time}\n\n` +
        `💊 Self-care advice:\n${advice}`;

      return res.json({
        sessionId,
        ...normalizeResponse({
          type: "message",
          reply,
          options: ["Start new chat", "Book Appointment"],
          update: state,
        }),
      });
    }

    // ===========================
    // 🔹 NORMAL CHAT FLOW
    // ===========================

    // ✅ 1) FIRST MESSAGE WITH UNKNOWN SYMPTOM → let Gemini handle it
    const hasMainSymptom = !!state.answers.mainSymptom;
    const lower = text.toLowerCase();

    const isKnownMainSymptom = KNOWN_MAIN_SYMPTOMS.includes(lower);

    if (!hasMainSymptom && text && !isKnownMainSymptom) {
      // Treat user's free-text as main symptom, but let AI drive the conversation
      state.answers.mainSymptom = text;
      await saveState(sessionId, state);

      const aiResult = await aiDoctorFollowup(text, state);

      const baseReply =
        `Got it, you’re feeling "${text}".\n` +
        aiResult.reply +
        `\n\n(Please remember this chat is informational only and not a diagnosis.)`;

      const responsePayload = {
        type: "message",
        reply: baseReply,
        options: aiResult.options && aiResult.options.length ? aiResult.options : [],
        update: state,
      };

      // If emergency flagged, send it back so frontend can show a special banner/message
      if (aiResult.emergency && aiResult.emergency.flag) {
        responsePayload.emergency = aiResult.emergency;
      }

      return res.json({
        sessionId,
        ...normalizeResponse(responsePayload),
      });
    }

    // ✅ 2) OTHERWISE → use your existing symptomAgent rules
    const agentResp = await symptomAgent(text, state);

    const updatedState = { ...state, ...(agentResp.update || {}) };
    await saveState(sessionId, updatedState);

    const safeResp = normalizeResponse(agentResp);
    safeResp.update = updatedState;

    // In future, we can still use aiDoctorFollowup here if symptomAgent says "fallbackToAI".
    return res.json({ sessionId, ...safeResp });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res
      .status(500)
      .json({ error: "Server error", details: err.message || "Unknown" });
  }
};
