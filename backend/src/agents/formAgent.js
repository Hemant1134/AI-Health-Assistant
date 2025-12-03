module.exports = async function formAgent(context = {}, state = {}) {
  // Build a simple form to validate/collect structured data for fever
  if (state.symptoms && state.symptoms.includes("fever")) {
    return {
      type: "form",
      title: "Fever Assessment Form",
      fields: [
        { name: "duration", label: "Duration (e.g., 1-3 days)", type: "text", required: true },
        { name: "temperature", label: "Temperature (°F)", type: "text" },
        { name: "medication", label: "Medication taken (if any)", type: "text" }
      ],
      update: state
    };
  }
  return {
    type: "form",
    title: "Patient Intake",
    fields: [{ name: "symptom_description", label: "Describe symptom", type: "text", required: true }],
    update: state
  };
};
