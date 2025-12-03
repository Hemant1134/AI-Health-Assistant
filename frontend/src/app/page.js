"use client";
import ChatBox from "../components/ChatBox";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

export default function Page() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ background: "linear-gradient(90deg,#0f172a 0%, #0066FF 60%)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>AI Health Assistant</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, p: 2, bgcolor: "#f6f9fc" }}>
        <ChatBox />
      </Box>
    </Box>
  );
}
