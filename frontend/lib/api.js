export async function sendMessage(message, _state, sessionId) {
  const res = await fetch("http://localhost:5002/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "x-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
}

export async function getHistory() {
  try {
    const res = await fetch("http://localhost:5002/api/history", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (e) {
    console.error("history fetch error", e);
    return [];
  }
}
