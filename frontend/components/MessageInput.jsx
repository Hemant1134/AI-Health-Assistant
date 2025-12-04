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
    <Box sx={{ display: "flex", p: 1.3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <TextField
        fullWidth
        placeholder="Describe your symptoms..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.08)",
            color: "#fff",
          },
        }}
      />
      <IconButton color="primary" onClick={send}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
