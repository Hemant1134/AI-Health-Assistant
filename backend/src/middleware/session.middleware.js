const { v4: uuidv4 } = require("uuid");

/**
 * Ensure each request has a sessionId:
 * - from header "x-session-id"
 * - or body.sessionId
 * - or generate new
 */
module.exports = function (req, res, next) {
  let sessionId = req.headers["x-session-id"] || req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = Date.now().toString();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
  }

  req.sessionId = sessionId;
  next();
};
