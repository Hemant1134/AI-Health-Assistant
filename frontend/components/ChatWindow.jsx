"use client";

import { Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import Options from "./Options";
import DynamicForm from "./DynamicForm";
import TypingDots from "./TypingDots";
import { sendMessage } from "../lib/api";
import { getSessionId } from "../lib/session";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [formSchema, setFormSchema] = useState(null);
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, options, formSchema]);

  async function handleUserInput(input) {
    setMessages((m) => [...m, { sender: "user", text: input }]);
    setTyping(true);

    const res = await sendMessage(input, state, getSessionId());
    setTyping(false);

    if (res.reply) setMessages((m) => [...m, { sender: "ai", text: res.reply }]);
    if (res.update) setState((p) => ({ ...p, ...res.update }));

    setOptions(res.options || []);
    setFormSchema(res.type === "form" ? res.form : null);
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        background: "#0b141a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        ref={ref}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          backgroundImage: "url('https://i.imgur.com/hNGYw9V.png')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat"
        }}
      >
        {messages.map((m, i) => <ChatBubble key={i} sender={m.sender} text={m.text} />)}
        {typing && <TypingDots />}
        {options.length > 0 && <Options options={options} onSelect={handleUserInput} />}
        {formSchema && <DynamicForm schema={formSchema} onSubmit={handleUserInput} />}
      </Box>

      <MessageInput onSend={handleUserInput} />
    </Box>
  );
}
