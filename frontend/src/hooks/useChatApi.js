    import axios from "axios";

export function useChatApi() {
  async function sendMessage(message) {
    const res = await axios.post("/api/chat", { message });
    return res.data;
  }
  return { sendMessage };
}
