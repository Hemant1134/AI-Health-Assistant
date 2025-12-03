require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../src/db/connection");
const chatRoutes = require("../src/routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.error("MongoDB err:", e.message));

// routes
app.use("/api/chat", chatRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
