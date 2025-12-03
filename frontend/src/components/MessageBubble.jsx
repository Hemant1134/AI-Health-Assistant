import React from "react";
import { Box, Avatar } from "@mui/material";

export default function MessageBubble({ sender, text, time }) {
  const isUser = sender === "user";
  return (
    <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", mb: 1 }}>
      <Box sx={{
        bgcolor: isUser ? "primary.main" : "white",
        color: isUser ? "white" : "text.primary",
        px: 2, py: 1, borderRadius: 2, maxWidth: "75%", boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.06)"
      }}>
        <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
        {time && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>{new Date(time).toLocaleTimeString()}</div>}
      </Box>
    </Box>
  );
}
