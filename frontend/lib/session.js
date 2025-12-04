export function getSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}
