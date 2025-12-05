import axios from "axios";

// Change here later for production
const BASE_URL = "http://localhost:5002/api";

// ==================== AI CHAT APIs ====================

// Send user message
export async function sendMessage(message, _state, sessionId) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "x-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
}

//  Get chat history
export async function getHistory(sessionId) {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(sessionId ? { "x-session-id": sessionId } : {}),
      },
    });
    return res.json();
  } catch (e) {
    console.error("History fetch error:", e);
    return [];
  }
}

// ==================== AUTH APIs ====================

// Signup new user
export const signupAPI = (data) => {
  return axios.post(`${BASE_URL}/signup`, data, { withCredentials: true });
};

// Login user
export const loginAPI = (data) => {
  return axios.post(`${BASE_URL}/login`, data, { withCredentials: true });
};

// Get logged-in profile
export const profileAPI = () => {
  return axios.get(`${BASE_URL}/profile`, { withCredentials: true });
};

// Logout user
export const logoutAPI = () => {
  return axios.get(`${BASE_URL}/logout`, { withCredentials: true });
};
