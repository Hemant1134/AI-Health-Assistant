"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Box sx={{ display: "flex", p: 1.5, borderTop: "1px solid #dbeafe", bgcolor: "#ffffff" }}>
      <TextField
        fullWidth
        value={input}
        placeholder="Describe your symptoms..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: 999,
            bgcolor: "#f8fafc",
            color: "#1e293b",
            px: 2,
          },
        }}
      />
      <IconButton onClick={send} sx={{ ml: 1, bgcolor: "#2563EB", color: "#fff", "&:hover": { bgcolor: "#1D4ED8" } }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
