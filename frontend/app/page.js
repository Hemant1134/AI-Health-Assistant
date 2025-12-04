"use client";

import { Box } from "@mui/material";
import ChatContainer from "../components/ChatContainer";

export default function Home() {
  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <ChatContainer />
    </Box>
  );
}
