export function getSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = Math.random().toString(36).substring(2);
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}
