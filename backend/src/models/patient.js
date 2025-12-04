const mongoose = require("mongoose");

module.exports = mongoose.model("Patient", new mongoose.Schema({
  sessionId: { type:String, index:true },
  personal: Object,
  symptoms: Object,
  summary: String,
  riskLevel: String
},{ timestamps:true }));
