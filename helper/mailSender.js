import pug from "pug";
import nodemailer from "nodemailer";
import path from "node:path";
import { emailConfig } from "../config/mailConfig.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport(emailConfig);
export const sendEmailWithTemplate = async (
  receiverEmail,
  emailTemplate,
  emailTitle,
  datas,
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, "../templete", emailTemplate);

  const compiledFunction = pug.compileFile(templatePath);
  //compile function will put the values in the above data like name ddata s in compilefunction name will replace by it
  const emailHtml = compiledFunction(datas);
  const emailDetails = {
    from: process.env.SMTP_USER,
    to: receiverEmail,
    subject: emailTitle,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(emailDetails);
  } catch (error) {
    console.log(error);
    console.log(`error Sending the mail ${error.message}`);
  }
};
