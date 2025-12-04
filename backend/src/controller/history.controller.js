const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

exports.getHistory = async (req, res) => {
  try {
    const sessionId =
      req.sessionId || req.headers["x-session-id"] || req.query.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const patients = await Patient.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const history = [];

    for (const p of patients) {
      const appt = await Appointment.findOne({ patientId: p._id })
        .sort({ createdAt: -1 })
        .lean();

      history.push({
        id: p._id,
        createdAt: p.createdAt,
        personal: p.personal,
        summary: p.summary,
        riskLevel: p.riskLevel,
        appointment: appt
          ? {
              department: appt.department,
              doctor: appt.doctor,
              date: appt.date,
              time: appt.time,
              status: appt.status,
            }
          : null,
      });
    }

    res.json({ sessionId, history });
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
