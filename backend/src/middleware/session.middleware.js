const { v4: uuidv4 } = require("uuid");

/**
 * Ensure each request has a sessionId:
 * - from header "x-session-id"
 * - or body.sessionId
 * - or generate new
 */
module.exports = function sessionMiddleware(req, res, next) {
  let sid = req.headers["x-session-id"] || req.body.sessionId;
  if (!sid) sid = uuidv4();

  req.sessionId = sid;
  res.setHeader("x-session-id", sid);

  next();
};
