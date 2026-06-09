import { createClient } from "redis";
const client = createClient({
  url: "redis://localhost:6379",
});
client.on("error", (err) => {
  console.error("Redis Error:", err);
});
export const connectRedis = () => {
  client.connect();
  console.log("Redis is connected");
};
