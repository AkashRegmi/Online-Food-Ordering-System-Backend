import { Redis } from "ioredis";

export const connection = new Redis({
  // host: "redis-server",
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});
