require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const chatRoutes = require("./routes/chat");
const sessionMiddleware = require("./middleware/session.middleware");
const historyRoutes = require("./routes/history.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Attach sessionId for every request
app.use(sessionMiddleware);

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Connect DB and start server
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
