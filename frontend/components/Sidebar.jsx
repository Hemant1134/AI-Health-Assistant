"use client";

import { Box, Typography, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHistory } from "../lib/api";

export default function Sidebar() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  return (
    <Box
      sx={{
        width: 360,
        height: "100vh",
        bgcolor: "#111b21",
        borderRight: "1px solid #2a3942",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #2a3942" }}>
        <Typography fontWeight={600}>🕒 Visit history</Typography>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          Previous diagnosis & suggestions
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#2a3942" }} />

      <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {history.map((h, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            sx={{
              p: 1.5,
              borderRadius: 1,
              cursor: "pointer",
              mb: 1,
            }}
          >
            <Typography fontWeight={600}>
              {h.personal?.name} • {h.personal?.age} yrs
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {h.summary?.slice(0, 55)}...
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
