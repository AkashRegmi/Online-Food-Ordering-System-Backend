import { Redis } from "ioredis";

export const connection = new Redis({
  host: "redis-server",
  port: 6379,
  maxRetriesPerRequest: null,
});
