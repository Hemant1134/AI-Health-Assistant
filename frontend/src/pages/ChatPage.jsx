import { Card, ScrollArea, Box } from "@mantine/core";
import { useState } from "react";
import { useChatApi } from "../hooks/useChatApi";
import Header from "../components/Header";
import Message from "../components/Message";
import ChatInput from "../components/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const { sendMessage } = useChatApi();

  async function handleSend(msg) {
    setMessages((m) => [...m, { sender: "user", text: msg }]);
    const res = await sendMessage(msg);
    setMessages((m) => [...m, { sender: "bot", text: res.reply }]);
  }

  return (
    <Box sx={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", padding: 10
    }}>
      <Card shadow="xl" radius="lg" p="md" sx={{
        width: 420, height: "80vh", display: "flex"
      }}>
        <Header />
        <ScrollArea style={{ flex: 1 }} scrollbarSize={5} px="xs" pt="xs">
          {messages.map((m, i) => (
            <Message key={i} sender={m.sender} text={m.text} />
          ))}
        </ScrollArea>
        <ChatInput onSend={handleSend} />
      </Card>
    </Box>
  );
}
