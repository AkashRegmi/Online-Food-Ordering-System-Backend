import { Queue } from "bullmq";
import { connection } from "../config/bullMqRedisConfig.js";
export const emailQueue = new Queue("emailQueue", { connection });
