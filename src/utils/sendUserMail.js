import { sendMail } from "./mailer";

export const sendUserMail = async ({ email, type, value, stakeHolder }) => {
  if (!email) {
    return { success: false, skipped: true, reason: "No email provided" };
  }

  const frontendDomain = process.env.FRONTEND_DOMAIN;

  const mailType = type === "A" ? "Account" : "Password";

  const subject =
    type === "A" ? "Account Created Successfully" : "Password Reset Details";

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 16px;">${mailType} Details</h2>

      <p>Hi ${stakeHolder || email},</p>

      <p>
        ${mailType} details have been created for your account on 
        <a href="${frontendDomain}sign-in">
          ${frontendDomain.replace(/\/$/, "").split("/")[2]}
        </a>
      </p>

      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Account Name</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${stakeHolder}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>${mailType} Value</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${value}</td>
        </tr>
      </table>

      <br/>
      <p>Best,<br/>Tender Bharo</p>
    </div>
  `;

  const textBody = [
    `${mailType} Details`,
    `Hi ${stakeHolder || email}`,
    `${mailType} details have been created for your account`,
    `Account Name: ${email}`,
    `${mailType} Value: ${value}`,
  ].join("\n");

  await sendMail({
    to: email,
    subject,
    text: textBody,
    html: htmlBody,
  });

  return { success: true };
};
