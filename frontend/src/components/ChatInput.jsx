import { ActionIcon, Group, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (msg.trim()) {
      onSend(msg);
      setMsg("");
    }
  };

  return (
    <Group p="xs">
      <TextInput
        placeholder="Type your message..."
        style={{ flex: 1 }}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <ActionIcon radius="xl" color="blue" variant="filled" onClick={handleSend}>
        <IconSend size={18} />
      </ActionIcon>
    </Group>
  );
}
