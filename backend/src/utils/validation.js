/**
 * Normalize response shape for frontend.
 * Frontend expects:
 *  { type, reply, options[], form?, update{} }
 */
function normalizeResponse(resp) {
  return {
    type: resp?.type || "message",
    reply: resp?.reply || "Sorry, I didn't understand that.",
    options: Array.isArray(resp?.options) ? resp.options : [],
    form: resp?.form || null,
    update: resp?.update && typeof resp.update === "object" ? resp.update : {}
  };
}

module.exports = { normalizeResponse };
