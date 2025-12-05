"use client";

import { Box } from "@mui/material";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";

export default function ChatPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [loading, user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Sidebar />
      <ChatWindow />
    </Box>
  );
}
