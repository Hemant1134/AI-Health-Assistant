"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function ChatBubble({ sender, text }) {
  const isAI = sender === "ai";

  const formatText = (val) => {
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join(", ");
    if (val && typeof val === "object") {
      return Object.entries(val)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    }
    return String(val ?? "");
  };

  return (
    <Box
      component={motion.div}
      initial={{ x: isAI ? -20 : 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      sx={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        mb: 1.2,
      }}
    >
      <Typography
        sx={{
          p: 1.2,
          px: 2,
          maxWidth: "82%",
          borderRadius: isAI ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
          bgcolor: isAI ? "#E8EDFF" : "#2563EB",
          color: isAI ? "#1e3a8a" : "#fff",
          border: isAI ? "1px solid #bfdbfe" : "none",
          fontSize: 14,
          whiteSpace: "pre-wrap",
          lineHeight: 1.4,
        }}
      >
        {formatText(text)}
      </Typography>
    </Box>
  );
}
