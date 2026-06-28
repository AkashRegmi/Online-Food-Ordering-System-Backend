import { createClient } from "redis";
const client = createClient({
  url: process.env.REDIS_URL,
  // url: "redis://redis-server:6379",
});
client.on("error", (err) => {
  console.error("Redis Error:", err);
});
export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis is connected");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    throw err;
  }
};
