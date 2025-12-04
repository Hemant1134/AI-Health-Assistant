"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import TypingDots from "./TypingDots";
import Options from "./Options";
import DynamicForm from "./DynamicForm";
import { motion } from "framer-motion";
import { sendMessage, fetchHistory } from "../lib/api";
import { getSessionId } from "../lib/session";
import HistoryDrawer from "./HistoryDrawer";

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi, I’m your Health Assistant. What symptoms are you facing?",
    },
  ]);
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState(null);
  const [typing, setTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const chatRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, options, form]);

  async function handleSend(input) {
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setTyping(true);

    const res = await sendMessage(input, getSessionId());
    setTyping(false);

    if (res.reply) {
      setMessages((m) => [...m, { sender: "ai", text: res.reply }]);
    }

    if (res.options && res.options.length) {
      setOptions(res.options);
    } else {
      setOptions([]);
    }

    if (res.type === "form" && res.form) {
      setForm(res.form);
    } else {
      setForm(null);
    }
  }

  async function openHistory() {
    const sessionId = getSessionId();
    const data = await fetchHistory(sessionId);
    setHistory(data.history || []);
    setHistoryOpen(true);
  }

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={{
          width: "100%",
          maxWidth: 480,
          height: isMobile ? "92vh" : "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          backdropFilter: "blur(14px)",
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(148,163,184,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              AI Health Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Your medical triage companion
            </Typography>
          </Box>
          <IconButton
            size="small"
            color="inherit"
            onClick={openHistory}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(148,163,184,0.6)",
              bgcolor: "rgba(15,23,42,0.8)",
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* CHAT BODY */}
        <Box ref={chatRef} sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {messages.map((m, i) => (
            <ChatBubble key={i} sender={m.sender} text={m.text} />
          ))}
          {typing && <TypingDots />}
          {options.length > 0 && (
            <Options options={options} onSelect={handleSend} />
          )}
          {form && <DynamicForm schema={form} onSubmit={handleSend} />}
        </Box>

        {/* INPUT */}
        <MessageInput onSend={handleSend} />
      </Card>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
      />
    </>
  );
}
