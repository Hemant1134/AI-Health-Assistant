const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    personal: {
      name: String,
      age: String,
      gender: String,
      city: String,
      chronic_conditions: String,
      allergies: String,
      emergency_contact: String
    },
    symptoms: Object, // answers like { fever: {...}, otherSymptoms: "...", ... }
    summary: String,
    riskLevel: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
