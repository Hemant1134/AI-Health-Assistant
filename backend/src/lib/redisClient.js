const { createClient } = require("redis");

const url = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({ url });

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err.message);
});

client.on("connect", () => {
  console.log("✅ Redis connected");
});

client.connect().catch(err => {
  console.error("Redis connect failed:", err.message);
});

module.exports = client;
