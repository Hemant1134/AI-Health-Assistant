const redis = require("../lib/redisClient");

const TTL = parseInt(process.env.SESSION_TTL_SECONDS || "86400", 10); // 1 day

function key(sessionId) {
  return `patientState:${sessionId}`;
}

async function getState(sessionId) {
  if (!sessionId) return {};
  const raw = await redis.get(key(sessionId));
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveState(sessionId, state) {
  if (!sessionId) return;
  await redis.setEx(key(sessionId), TTL, JSON.stringify(state));
}

module.exports = { getState, saveState };
