export async function sendMessage(message, sessionId) {
  const res = await fetch("http://localhost:5002/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-id": sessionId,
    },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function fetchHistory(sessionId) {
  const res = await fetch(
    `http://localhost:5002/api/history?sessionId=${encodeURIComponent(
      sessionId
    )}`,
    {
      headers: {
        "x-session-id": sessionId,
      },
    }
  );
  return res.json();
}

export async function getHistory() {
  const res = await fetch("http://localhost:5002/api/history", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  return res.json();
}
