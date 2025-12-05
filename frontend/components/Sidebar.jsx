"use client";

import { Box, Typography, Divider, Avatar, Button } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { getHistory } from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const COLORS = ["#2563EB", "#0EA5E9", "#F97316", "#EC4899", "#22C55E"];

export default function Sidebar() {
  const [history, setHistory] = useState([]);
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    getHistory().then((h) => {
      if (Array.isArray(h)) setHistory(h);
      if (h && Array.isArray(h.history)) setHistory(h.history);
    });
  }, []);

  const getColor = (i) => COLORS[i % COLORS.length];

  const handleLogout = async () => {
    await axios.post("http://localhost:5002/api/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <Box
      sx={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#4C9DD8 0%, #6092bbff 100%)",
        borderRight: "1px solid #60a0ddff",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 2, borderBottom: "1px solid #7ca6ceff" }}>
        <Typography fontWeight={700} sx={{ fontSize: 16 }}>
          🕒 Visit history
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: 11 }}>
          Previous diagnosis & suggestions
        </Typography>
      </Box>

      {/* LIST */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 1.3 }}>
        {history.map((h, i) => (
          <Box
            key={h._id || i}
            component={motion.div}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            transition={{ duration: 0.15 }}
            sx={{
              p: 1.2,
              borderRadius: 1.5,
              cursor: "pointer",
              display: "flex",
              gap: 1.2,
              alignItems: "center",
              mb: 1,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: getColor(i),
                fontSize: 20,
                color: "#ffffff",
                fontWeight: 700,
              }}
            >
              +
            </Avatar>

            <Box sx={{ overflow: "hidden", color: "#fff" }}>
              <Typography fontWeight={600} noWrap sx={{ fontSize: 14 }}>
                {h.personal?.name || "Unknown"}{" "}
                {h.personal?.age && `• ${h.personal.age} yrs`}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                sx={{ opacity: 0.85, fontSize: 12 }}
              >
                {h.summary ||
                  "No summary available yet, complete a checkup to see here."}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", opacity: 0.75 }}
          >
            No previous visits yet.
          </Typography>
        )}
      </Box>

      {/* LOGOUT */}
      <Box sx={{ p: 2, borderTop: "1px solid #A8D5FF" }}>
        <Button
          fullWidth
          onClick={handleLogout}
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#0D67A8",
            "&:hover": { bgcolor: "#0B5A90" },
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          🚪 Logout
        </Button>
      </Box>
    </Box>
  );
}
