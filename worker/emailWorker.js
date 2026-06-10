import { Worker } from "bullmq";
import { connection } from "../config/bullMqRedisConfig.js";
import { sendEmailWithTemplate } from "../helper/mailSender.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("hi");
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
emailWorker.on("ready", () => {
  console.log("Worker is ready");
});
emailWorker.on("error", (err) => {
  console.log("Worker error:", err);
});

emailWorker.on("failed", (job, err) => {
  console.log("Job failed:", err);
});
emailWorker.on("active", (job) => {
  console.log("ACTIVE JOB:", job.name);
});

emailWorker.on("completed", (job) => {
  console.log("COMPLETED:", job.name);
});

emailWorker.on("failed", (job, err) => {
  console.log("FAILED:", err);
});
