import "dotenv/config";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import transporter from "../helpers/emailTransport.js";
import { systemLogs } from "./logger.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendEmail = async (email, subject, template, payload) => {
  try {
    const sourceDirectory = fs.readFileSync(
      path.join(__dirname, "utils", template),
      "utf8"
    );

    const compiledTemplate = handlebars.compile(sourceDirectory);

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: compiledTemplate(payload),
    };
    await transporter.sendMail(emailOptions);
  } catch (error) {
    systemLogs.error(`Error sending email: ${error}`);
  }
};
