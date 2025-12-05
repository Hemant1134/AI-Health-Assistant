const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

exports.getHistory = async (req, res) => {
  try {
    const list = await Patient.find().sort({ createdAt: -1 }).limit(50);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChatData = async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      
      const appointment = await Appointment.findOne({ patientId: patient._id });
      res.json({
        personal: patient.personal,
        summary: patient.summary,
        riskLevel: patient.riskLevel,
        appointment,
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}