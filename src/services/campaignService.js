import nodemailer from "nodemailer";
import { queryWithRetry } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { emailLog } from "@/utils/lib/functions";
import { error } from "console";

export const runtime = "nodejs";

export async function runCampaignJobs() {
  let mailSent = false;

  try {
    const campaigns = await queryWithRetry(`
      SELECT * FROM ${TABLE_LIST.CAMPAIGNS} 
      WHERE status = 0 
      AND schedule_at <= NOW()
    `);

    if (!campaigns?.length) return false;

    for (const campaign of campaigns) {
      const locked = await queryWithRetry(
        `UPDATE ${TABLE_LIST.CAMPAIGNS} 
         SET status = 2 
         WHERE id = $1 AND status = 0 
         RETURNING *`,
        [campaign.id],
      );
      if (!locked.length) continue;

      const sent = await processCampaign(campaign);

      if (sent) mailSent = true;

      await queryWithRetry(
        `UPDATE ${TABLE_LIST.CAMPAIGNS} SET status = 1 WHERE id = $1`,
        [campaign.id],
      );
    }

    return mailSent;
  } catch (err) {
    console.error("Scheduler error:", err);
    return false;
  }
}

async function processCampaign(campaign) {
  try {
    const senderRes = await queryWithRetry(
      `SELECT * FROM tbl_senders WHERE id = $1`,
      [campaign.sender_id],
    );

    const sender = senderRes?.[0];
    if (!sender) return false;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender.email,
        pass: sender.app_password,
      },
    });

    const recipients = await queryWithRetry(
      `SELECT id, email FROM ${TABLE_LIST.CAMPAIGNSRECIPIENTS} 
       WHERE campaign_id = $1 AND status = 0`,
      [campaign.id],
    );

    if (!recipients?.length) return false;

    const htmlBody = campaign.body || "";
    let result = null;
    for (const client of recipients) {
      try {
        result = await transporter.sendMail({
          from: sender.email,
          to: client.email,
          subject: campaign.subject || "No Subject",
          html: htmlBody,
        });

        await emailLog({
          activity: "campaign",
          email: client.email,
          subject: campaign.subject,
          body: htmlBody,
          info: result,
        });

        await queryWithRetry(
          `UPDATE ${TABLE_LIST.CAMPAIGNSRECIPIENTS} 
           SET status = 1, updated_at = NOW() 
           WHERE id = $1`,
          [client.id],
        );
      } catch (err) {
        await queryWithRetry(
          `UPDATE ${TABLE_LIST.CAMPAIGNSRECIPIENTS} 
           SET status = 2, updated_at = NOW() 
           WHERE id = $1`,
          [client.id],
        );

        await emailLog({
          activity: "campaign",
          email: client.email,
          subject: campaign.subject,
          body: htmlBody,
          error: err,
        });
      }
    }

    return true;
  } catch (err) {
    console.error("processCampaign error:", err);
    return false;
  }
}
