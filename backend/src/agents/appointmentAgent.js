module.exports = async function appointmentAgent(state = {}) {
  const main = state.symptoms?.[0] || "general";
  let department = "General Medicine";
  if (main === "breathing_issue") department = "Pulmonology";
  if (main === "stomach_pain") department = "Gastroenterology";
  if (main === "headache") department = "Neurology";

  const date = new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10);
  return { department, doctor:"Duty Doctor", date, time:"10:00 AM" };
};
