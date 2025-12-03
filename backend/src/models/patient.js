const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  sessionId: { type: String },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", PatientSchema);
