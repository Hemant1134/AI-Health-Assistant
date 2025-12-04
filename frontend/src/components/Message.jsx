import { Avatar, Box, Group, Text } from "@mantine/core";

export default function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <Group position={isUser ? "right" : "left"} mb={12} spacing={6}>
      {!isUser && <Avatar color="blue">🤖</Avatar>}

      <Box
        sx={{
          padding: "8px 14px",
          borderRadius: 16,
          background: isUser
            ? "linear-gradient(90deg,#4b8bff,#005bff)"
            : "#fff",
          color: isUser ? "#fff" : "#333",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxWidth: "70%",
        }}
      >
        <Text size="sm">{text}</Text>
      </Box>

      {isUser && <Avatar src="https://i.pravatar.cc/150" />}
    </Group>
  );
}
