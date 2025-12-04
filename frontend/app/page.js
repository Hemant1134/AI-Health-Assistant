"use client";

import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Page() {
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Sidebar />
      <ChatWindow />
    </Box>
  );
}
