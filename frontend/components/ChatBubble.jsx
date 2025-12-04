"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function ChatBubble({ sender, text }) {
  const isAI = sender === "ai";

  // 🛠 Convert object or array messages into readable text
  const formattedText =
    typeof text === "string"
      ? text
      : Array.isArray(text)
        ? text.join(", ")
        : typeof text === "object"
          ? Object.entries(text)
              .map(([key, val]) => `${key}: ${val}`)
              .join("\n")
          : ""; // fallback

  return (
    <Box
      component={motion.div}
      initial={{ x: isAI ? -20 : 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      sx={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          p: 1.2,
          px: 2,
          maxWidth: "80%",
          borderRadius: isAI ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          bgcolor: isAI ? "rgba(255,255,255,0.12)" : "primary.main",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 14,
          lineHeight: 1.4,
          whiteSpace: "pre-wrap", // allow multiple lines
        }}
      >
        {formattedText}
      </Typography>
    </Box>
  );
}
