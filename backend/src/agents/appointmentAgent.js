module.exports = async function appointmentAgent(context = {}, state = {}) {
  // Simple mocked appointment suggestion
  return {
    type: "appointment",
    department: "General Medicine",
    doctor: "Dr. Sharma",
    date: new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10),
    time: "10:00 AM",
    reply: "Suggested appointment with General Medicine.",
    update: state
  };
};
