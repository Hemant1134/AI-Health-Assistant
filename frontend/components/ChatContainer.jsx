"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Card, Typography } from "@mui/material";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import TypingDots from "./TypingDots";
import Options from "./Options";
import DynamicForm from "./DynamicForm";
import { motion } from "framer-motion";
import { sendMessage } from "../lib/api";
import { getSessionId } from "../lib/session";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "👋 Hi, I’m your Health Assistant. What symptoms are you facing?" }
  ]);
  const [options, setOptions] = useState([]);
  const [formSchema, setFormSchema] = useState(null);
  const [patientState, setPatientState] = useState({});
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, options, formSchema]);

  async function handleUserInput(input) {
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setTyping(true);

    const res = await sendMessage(input, patientState, getSessionId());
    setTyping(false);

    if (res.reply) setMessages((m) => [...m, { sender: "ai", text: res.reply }]);

    if (res.update) setPatientState((p) => ({ ...p, ...res.update }));

    setOptions(res.options || []);
    setFormSchema(res.type === "form" ? res.form : null);
  }

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      sx={{
        width: "100%",
        maxWidth: 420,
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        backdropFilter: "blur(14px)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography variant="h6" fontWeight={700}>AI Health Assistant</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>Your medical triage companion</Typography>
      </Box>

      <Box ref={ref} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
        {typing && <TypingDots />}
        {options.length > 0 && <Options options={options} onSelect={handleUserInput} />}
        {formSchema && <DynamicForm schema={formSchema} onSubmit={handleUserInput} />}
      </Box>

      <MessageInput onSend={handleUserInput} />
    </Card>
  );
}
