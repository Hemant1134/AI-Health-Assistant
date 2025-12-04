export async function sendMessage(message, patientState, sessionId) {
  const res = await fetch("http://localhost:5001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, patientState, sessionId }),
  });
  return res.json();
}
