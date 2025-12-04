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
        mb: 1,
      }}
    >
      <Typography
        sx={{
          p: 1.2,
          px: 2,
          maxWidth: "82%",
          borderRadius: isAI ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          bgcolor: isAI ? "rgba(30,64,175,0.7)" : "primary.main",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 14,
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
        }}
      >
        {formatText(text)}
      </Typography>
    </Box>
  );
}
