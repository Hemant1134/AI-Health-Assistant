"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Box } from "@mui/material";
import AuthScreen from "@/components/AuthScreen";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Page() {
  const { user, loading } = useContext(AuthContext);
  const [selectedHistory, setSelectedHistory] = useState(null);
  if (loading) return <div>Loading...</div>;

  if (!user) return <AuthScreen />;          // not logged in → stay login

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Sidebar onSelectChat={setSelectedHistory} activeChat={selectedHistory} />
      <ChatWindow selectedHistory={selectedHistory} />
    </Box>
  );
}
