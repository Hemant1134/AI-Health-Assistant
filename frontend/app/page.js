"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import AuthScreen from "../components/AuthScreen";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Page() {
  const [isAuthed, setIsAuthed] = useState(false);

  if (!isAuthed) {
    return <AuthScreen onAuthenticated={() => setIsAuthed(true)} />;
  }

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Sidebar />
      <ChatWindow />
    </Box>
  );
}
