"use client";

import { Box, Typography, Divider, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHistory } from "../lib/api";

const COLORS = ["#00A884", "#2563EB", "#F97316", "#EC4899", "#22C55E"];

export default function Sidebar() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then((h) => {
      if (Array.isArray(h)) setHistory(h);
      if (h && Array.isArray(h.history)) setHistory(h.history);
    });
  }, []);

  const getColor = (i) => COLORS[i % COLORS.length];

  return (
    <Box className="sidebar">
      {/* header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #2a3942" }}>
        <Typography fontWeight={600}>🕒 Visit history</Typography>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          Previous diagnosis & suggestions
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#2a3942" }} />

      {/* list */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {history.map((h, i) => (
          <Box
            key={h._id || i}
            component={motion.div}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            sx={{
              p: 1.2,
              borderRadius: 1.5,
              cursor: "pointer",
              display: "flex",
              gap: 1.5,
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
              }}
            >
              +
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography fontWeight={600} noWrap>
                {h.personal?.name || "Unknown"}{" "}
                {h.personal?.age && `• ${h.personal.age} yrs`}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }} noWrap>
                {h.summary ||
                  "No summary available yet, complete a checkup to see here."}
              </Typography>
            </Box>
          </Box>
        ))}

        {history.length === 0 && (
          <Typography
            variant="body2"
            sx={{ opacity: 0.6, mt: 3, textAlign: "center" }}
          >
            No previous visits yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
