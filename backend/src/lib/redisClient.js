const { createClient } = require("redis");

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect().then(() => console.log("Redis connected")).catch(err => console.error("Redis failed:", err));

module.exports = client;
