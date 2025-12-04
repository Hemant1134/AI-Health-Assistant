const mongoose = require("mongoose");

module.exports = mongoose.model("Appointment", new mongoose.Schema({
  patientId: { type:mongoose.Schema.Types.ObjectId, ref:"Patient" },
  department: String,
  doctor: String,
  date: String,
  time: String,
  status: { type:String, default:"Pending" },
  meta: Object
},{ timestamps:true }));
