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
