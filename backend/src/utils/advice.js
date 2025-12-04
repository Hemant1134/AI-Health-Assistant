// Simple, safe self-care suggestions.
// No prescriptions, no antibiotics, no diagnosis.

function buildAdvice(state = {}) {
  const main = state.symptoms?.[0] || "other";
  const fever = state.answers?.fever || {};
  const risk = state.riskLevel || "mild";

  const lines = [];

  // General
  lines.push("• Stay well hydrated with water or ORS 🥤");
  lines.push("• Get enough rest and sleep 😴");

  if (main === "fever") {
    lines.push(
      "• You may use paracetamol as per local guidelines if no allergy or liver issues"
    );
    lines.push("• Use light clothing and keep room temperature comfortable");
  }

  if (main === "cold" || main === "cough") {
    lines.push("• Warm fluids (soup, herbal tea, warm water with honey) 🍵");
    lines.push("• Steam inhalation can help with stuffy nose (careful with hot water)");
  }

  if (main === "stomach_pain") {
    lines.push("• Prefer light, low-fat meals and avoid spicy/oily food");
    lines.push("• Oral rehydration solution (ORS) if there is vomiting/loose motions");
  }

  if (main === "breathing_issue") {
    lines.push("• Avoid lying completely flat, keep head slightly elevated");
    lines.push("• Avoid smoke, dust or strong smells");
    lines.push("• Seek urgent in-person medical care if breathing worsens or chest pain appears ⚠️");
  }

  if (risk === "moderate" || risk === "high") {
    lines.push(
      "• Please consult a doctor in person as soon as possible for proper examination ⚠️"
    );
  } else {
    lines.push(
      "• If symptoms get worse, new symptoms appear, or you’re worried, see a doctor promptly."
    );
  }

  lines.push(
    "❗ This is general information and not a diagnosis or a replacement for a doctor visit."
  );

  return lines.join("\n");
}

module.exports = { buildAdvice };
