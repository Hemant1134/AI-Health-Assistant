"use client";
import { Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import Options from "./Options";
import DynamicForm from "./DynamicForm";
import TypingDots from "./TypingDots";
import { sendMessage, getChatDetails } from "../lib/api";
import { getSessionId } from "../lib/session";

export default function ChatWindow({ selectedHistory }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "👋 Hi, I’m your Health Assistant. What symptoms are you facing?" }
  ]);
  const [options, setOptions] = useState([]);
  const [formSchema, setFormSchema] = useState(null);
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);

  // When user clicks history → override chat with saved result
  useEffect(() => {
    if (!selectedHistory) return;

    (async () => {
      const data = await getChatDetails(selectedHistory);

      if (!data?.summary) return;

      setOptions([]);
      setFormSchema(null);

      const appointment = data?.appointment || {};

      setMessages([
        { sender: "ai", text: `❤️ ${data.personal?.name}` },
        { sender: "ai", text: `📝 ${data.summary}` },
        { sender: "ai", text: `⚠️ Risk: ${data.riskLevel?.toUpperCase()}` },
        {
          sender: "ai",
          text:
            `🏥 Dept: ${appointment.department}\n` +
            `👨‍⚕️ Doctor: ${appointment.doctor}\n` +
            `📅 ${appointment.date} at ${appointment.time}\n` +
            `📌 Status: ${appointment.status}`,
        },
      ]);
    })();
  }, [selectedHistory]);

  // Normal Live Flow
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, options, formSchema]);

  async function handleUserInput(input) {
    if (selectedHistory) {
      return; // Prevent editing old history
    }
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setTyping(true);

    const res = await sendMessage(input, {}, getSessionId());
    setTyping(false);

    if (res.reply) {
      setMessages((m) => [...m, { sender: "ai", text: res.reply }]);
    }
    setOptions(res.options || []);
    setFormSchema(res.type === "form" ? res.form : null);
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(135deg,#E8F1FF 0%,#EEF7FF 50%,#ffffff 100%)",
      }}
    >
      <Box ref={ref} sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        {messages.map((m, i) => (
          <ChatBubble key={i} sender={m.sender} text={m.text} />
        ))}
        {typing && <TypingDots />}
        {!selectedHistory && options.length > 0 && (
          <Options options={options} onSelect={handleUserInput} />
        )}
        {!selectedHistory && formSchema && (
          <DynamicForm schema={formSchema} onSubmit={handleUserInput} />
        )}
      </Box>

      {!selectedHistory && <MessageInput onSend={handleUserInput} />}
    </Box>
  );
}
