import crypto from "crypto";
import cryptoJS from "crypto-js";
import { TABLE_LIST } from "./tablesList";
import { db } from "./database";
import moment from "moment-timezone";
import { DB_TIME_FORMAT } from "./constants";

export const encryptPassword = (plainTextPassword) => {
  const hash = crypto.createHmac("sha512", process.env.AUTH_SECRET_KEY);
  const data = hash.update(plainTextPassword, "utf-8");
  return data.digest("hex");
};

export const decryptPassword = (hashPassword) => {
  return cryptoJS.AES.decrypt(
    hashPassword,
    process.env.NEXT_PUBLIC_LOGIN_PASSWORD_SECRET_KEY,
  ).toString(cryptoJS.enc.Utf8);
};

export const generateRandomString = (length = 10) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const sendMail = (to, subject, data, activity = "", operID = 0) => {
  if (!process.env.AWS_MAILER_ACCESS_KEY_ID) return false;

  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.AWS_MAILER_FROM_MAIL_ID,
      to: to,
      subject: subject,
      html: data,
    };

    transporterOttplay.verify(function (error, success) {
      if (error) {
        errorLogger(
          "Email Verify error for " + to + ": " + (error.message || error),
        );
        reject(error.message || error);
      } else {
        transporterOttplay.sendMail(mailOptions, (error, info) => {
          emailLog(to, subject, data, info, error, activity, operID);
          if (error) {
            errorLogger(
              "Email send error for " + to + ": " + (error.message || error),
            );
            reject(error);
          }
          resolve(info);
        });
      }
    });
  });
};

const sanitizeDB = (unsanitizeInput = "") => {
  return unsanitizeInput
    .replace(/\n{2,}/g, "")
    .replace(/'/g, "/'")
    .replace(/;/g, "&456");
};

export const emailLog = async ({
  email,
  subject,
  body,
  info,
  error,
  activity = "",
}) => {
  const query = `
    INSERT INTO ${TABLE_LIST.EMAIL_LOGS} 
    (email, subject, body, activity, inserted_date, status, response) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const params = [
    email,
    subject,
    sanitizeDB(body),
    activity,
    moment().format(DB_TIME_FORMAT),
    error ? "failed" : "sent",
    error ? JSON.stringify(error) : info?.messageId || null,
  ];

  try {
    // await db.none(query, params);
  } catch (err) {
    console.error("emailLog error:", err);
  }
};
