const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

/* ===========================================
   Generate HTTP-Only Cookie (Auto Secure Mode)
=========================================== */
const sendCookie = (req, res, token) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });
};

/* ===========================================
                  SIGNUP
=========================================== */
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    let exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hash });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    sendCookie(req, res, token);
    return res.json({ message: "Signup successful!", user: { fullName, email } });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Signup failed, try again!" });
  }
};

/* ===========================================
                    LOGIN
=========================================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password){
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    sendCookie(req, res, token);
    return res.json({
      message: "Login successful!",
      user: { fullName: user.fullName, email },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed, try again!" });
  }
};

/* ===========================================
                  GET PROFILE
=========================================== */
const getProfile = async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Authenticated", user });
  } catch (err) {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};

/* ===========================================
                    LOGOUT
=========================================== */
const logout = (req, res) => {
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.json({ message: "Logged out successfully!" });
};

module.exports = { signup, login, logout, getProfile };
