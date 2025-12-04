import { Avatar, Badge, Group, Text } from "@mantine/core";

export default function Header() {
  return (
    <Group position="apart" mb="xs" p={5}>
      <Group>
        <Avatar radius="xl" color="blue" size="md">💬</Avatar>
        <Text weight={600}>AI Health Assistant</Text>
      </Group>
      <Badge color="green" radius="lg" variant="filled">Online</Badge>
    </Group>
  );
}
