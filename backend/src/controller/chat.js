const redis = require("../lib/redisClient");
const { v4: uuidv4 } = require("uuid");
const symptomAgent = require("../agents/symptomAgent");
const formAgent = require("../agents/formAgent");
const appointmentAgent = require("../agents/appointmentAgent");
const Patient = require("../models/patient");

const SESSION_TTL = parseInt(process.env.SESSION_TTL_SECONDS || "86400", 10);

function makeSafe(resp) {
  return {
    type: (resp && resp.type) || "message",
    reply: (resp && resp.reply) || "Sorry, I didn't understand.",
    options: Array.isArray(resp && resp.options) ? resp.options : [],
    update: (resp && resp.update) || {}
  };
}

async function loadState(sessionId) {
  if (!sessionId) return null;
  const raw = await redis.get(`patientState:${sessionId}`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

async function saveState(sessionId, state) {
  await redis.setEx(`patientState:${sessionId}`, SESSION_TTL, JSON.stringify(state));
}

exports.handleChat = async (req, res) => {
  try {
    // body: { message, sessionId }
    const { message, sessionId: incomingSession } = req.body;

    // ensure session
    const sessionId = incomingSession || uuidv4();

    // load
    let state = (await loadState(sessionId)) || {
      asked: [],
      answers: {},
      symptoms: [],
      personal: {},
      step: "greeting",
      completed: false,
      createdAt: Date.now()
    };

    // if message is object => treat as form submission
    let agentResp;
    if (message && typeof message === "object" && !Array.isArray(message)) {
      agentResp = await formAgent(message, state);
      // merge agentResp.update into state
      state = { ...state, ...agentResp.update, ...{ answers: { ...state.answers, ...(agentResp.update.answers || {}) } } };
      // optionally persist patient to DB
      await saveState(sessionId, state);
      // if profile complete, save to Mongo
      if (state.completed) {
        await Patient.create({ sessionId, data: state });
      }
      return res.json({ sessionId, ...makeSafe(agentResp) });
    }

    // normal text
    agentResp = await symptomAgent(String(message || ""), state);

    // process returned update into our state
    if (agentResp && agentResp.update && typeof agentResp.update === "object") {
      // merge update fields shallowly
      state = { ...state, ...agentResp.update };
      // ensure arrays/objects preserved
      state.asked = Array.isArray(state.asked) ? state.asked : [];
      state.symptoms = Array.isArray(state.symptoms) ? state.symptoms : state.symptoms || [];
      state.answers = state.answers || {};
    }

    // Save state to Redis
    await saveState(sessionId, state);

    // If agent suggests form or appointment and wants DB save, do that
    if (agentResp.type === "form" && state.completed) {
      await Patient.create({ sessionId, data: state });
    }

    return res.json({ sessionId, ...makeSafe(agentResp) });
  } catch (err) {
    console.error("CHAT CONTROLLER ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
