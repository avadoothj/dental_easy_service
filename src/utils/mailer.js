"use server";

import nodemailer from "nodemailer";

const createMailTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

export const getMailerSourceEmail = () =>
  process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

export const sendMail = async ({ to, subject, text, html, from }) => {
  const sourceEmail = from || (await getMailerSourceEmail());
  if (!sourceEmail) {
    throw new Error("SMTP sender email is not configured");
  }

  if (!process.env.SMTP_HOST) {
    throw new Error("SMTP host is not configured");
  }

  const recipients = Array.isArray(to)
    ? to.filter(Boolean)
    : [to].filter(Boolean);

  if (!recipients.length) {
    throw new Error("Mail recipient is not configured");
  }

  const transporter = createMailTransporter();
  const cleanEmail = sourceEmail.trim();
  const formattedFrom = cleanEmail.includes("<")
    ? cleanEmail
    : `<${cleanEmail}>`;
  return transporter.sendMail({
    from: formattedFrom,
    to: recipients.join(","),
    subject,
    text,
    html,
  });
};
