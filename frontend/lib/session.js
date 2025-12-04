const KEY = "ai_health_session";

export function getSessionId() {
  if (typeof window === "undefined") return null;
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(KEY, sid);
  }
  return sid;
}
