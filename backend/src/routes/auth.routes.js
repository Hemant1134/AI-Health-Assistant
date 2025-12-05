const express = require("express");
const router = express.Router();
const { signup, login, logout, getProfile } = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup",          signup);
router.post("/login",           login);
router.post("/logout",          logout);
router.get("/profile",          authMiddleware, getProfile);

module.exports = router;
