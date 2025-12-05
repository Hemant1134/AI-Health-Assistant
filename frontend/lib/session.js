export function getSessionId() {
  let id = localStorage.getItem("sessionId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
  }
  return id;
}

export function saveUserToken(token) {
  localStorage.setItem("authToken", token);
}

export function getUserToken() {
  return localStorage.getItem("authToken");
}

export function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("sessionId");
}
