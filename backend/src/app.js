require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connection");
const chatRoutes = require("./routes/chat");
const sessionMiddleware = require("./middleware/session.middleware");
const historyRoutes = require("./routes/history.routes");
const authRoutes = require("./routes/auth.routes");
const authGuard = require("./middleware/auth.middleware");

const app = express();

//  Correct CORS for cookies + login
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization, x-session-id"
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Attach sessionId for chat messages
app.use(sessionMiddleware);

// Routes
app.use("/api",         authRoutes); 
app.use("/api/chat",    authGuard, chatRoutes);
app.use("/api/history", authGuard, historyRoutes);

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
