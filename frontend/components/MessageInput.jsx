"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 1.5,
        borderTop: "1px solid #202c33",
        bgcolor: "#202c33",
      }}
    >
      <TextField
        fullWidth
        value={input}
        placeholder="Describe your symptoms..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: 999,
            bgcolor: "#111b21",
            color: "#fff",
            px: 2,
          },
        }}
      />
      <IconButton onClick={handleSend} sx={{ ml: 1, color: "#00A884" }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
