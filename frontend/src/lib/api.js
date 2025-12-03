export async function sendMessage(message, patientState, sessionId) {
  try {
    const payload = { message, sessionId };
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "API error");
    }
    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    return { type: "message", reply: "Unable to reach server." };
  }
}
