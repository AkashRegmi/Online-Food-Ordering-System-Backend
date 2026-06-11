import { emailQueue } from "../Queue/emailQueue.js";

export const sendEmailHelper = async (
  job,
  receiverEmail,
  emailTemplate,
  emailTitle,
  datas,
) => {
  await emailQueue.add(job, {
    receiverEmail,
    emailTemplate,
    emailTitle,
    datas,
  });
};
