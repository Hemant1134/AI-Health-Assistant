const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📌 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error", err);
    process.exit(1);
  }
};
