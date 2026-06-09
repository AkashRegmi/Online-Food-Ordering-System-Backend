import { Worker } from "bullmq";
import { connection } from "../config/bullMqRedisConfig.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { receiverEmail, emailTemplate, emailTitle, datas } = job.data;
    await sendEmailWithTemplate(
      receiverEmail,
      emailTemplate,
      emailTitle,
      datas,
    );
  },
  {
    connection,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
);
