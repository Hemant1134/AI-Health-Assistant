const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  department: String,
  doctor: String,
  date: String,
  time: String,
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
