"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import { Box } from "@mui/material";

export default function ChatPage() {
  const { user, loading } = useContext(AuthContext);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [loading, user, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {/* Pass action to Sidebar */}
      <Sidebar onSelectChat={setSelectedHistory} activeChat={selectedHistory} />

      {/* Pass selected history to Chat */}
      <ChatWindow selectedHistory={selectedHistory} />
    </Box>
  );
}
