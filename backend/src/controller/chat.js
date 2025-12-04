const { getState, saveState } = require("../utils/state");
const { normalizeResponse } = require("../utils/validation");
const symptomAgent = require("../agents/symptomAgent");
const summaryAgent = require("../agents/summaryAgent");
const appointmentAgent = require("../agents/appointmentAgent");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

// Allowed personal fields (Option A)
const ALLOWED_PERSONAL_FIELDS = [
  "name",
  "age",
  "gender",
  "city",
  "chronic_conditions",
  "allergies",
  "emergency_contact"
];

exports.handleChat = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const { message } = req.body;

    let state = await getState(sessionId);
    state = state || {};
    state.symptoms = state.symptoms || [];
    state.answers = state.answers || {};
    state.personal = state.personal || {};
    state.asked = state.asked || [];
    state.completed = !!state.completed;
    if (patientState.profileComplete) {
      return res.json({
        type: "done",
        reply: "You’re already registered. Start a new chat or get appointment ❤️",
        options: ["Start new chat", "Book Appointment"]
      });
    }

    // CASE 1: form submission (personal details)
    if (message && typeof message === "object" && !Array.isArray(message)) {
      // Filter only allowed fields
      const incoming = message || {};
      const cleaned = {};
      for (const key of ALLOWED_PERSONAL_FIELDS) {
        if (incoming[key] !== undefined && incoming[key] !== null && incoming[key] !== "") {
          cleaned[key] = String(incoming[key]);
        }
      }

      state.personal = { ...state.personal, ...cleaned };
      state.completed = true;
      state.step = "summary";

      // Generate summary & appointment
      const summaryRes = await summaryAgent(state);
      state.summary = summaryRes.summary;
      state.riskLevel = summaryRes.riskLevel;

      const apptRes = await appointmentAgent(state);
      state.recommendation = apptRes;

      // Save patient + appointment
      const patientDoc = await Patient.create({
        sessionId,
        personal: state.personal,
        symptoms: state.answers,
        summary: state.summary,
        riskLevel: state.riskLevel
      });

      await Appointment.create({
        patientId: patientDoc._id,
        department: apptRes.department,
        doctor: apptRes.doctor,
        date: apptRes.date,
        time: apptRes.time,
        meta: apptRes
      });

      await saveState(sessionId, state);

      const resp = {
        type: "message",
        reply:
          `Thanks ${state.personal.name || ""}. I’ve created your health profile.\n\n` +
          `Summary: ${state.summary}\n` +
          `Risk level: ${state.riskLevel.toUpperCase()}\n` +
          `Recommended department: ${apptRes.department}\n` +
          `Suggested time: ${apptRes.date} at ${apptRes.time}`,
        options: ["Start new chat"],
        update: state
      };

      return res.json({ sessionId, ...normalizeResponse(resp) });
    }

    // CASE 2: normal text → symptomAgent
    const text = (message || "").toString();
    const agentResp = await symptomAgent(text, state);

    const updatedState = { ...state, ...(agentResp.update || {}) };
    await saveState(sessionId, updatedState);

    const safeResp = normalizeResponse(agentResp);
    safeResp.update = updatedState;

    return res.json({ sessionId, ...safeResp });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
