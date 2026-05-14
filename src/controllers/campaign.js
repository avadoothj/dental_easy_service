"use server";

import { queryWithRetry } from "@/utils/lib/database";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";
import { TABLE_LIST } from "@/utils/lib/tablesList";

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const BASE_URL = process.env.BASE_IMG_URL;

const saveFileLocal = async (file) => {
  if (!file || file.size === 0) return null;

  const now = new Date();

  const monthName = now
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase();

  const yearShort = String(now.getFullYear()).slice(-2);

  const folderName = `${monthName}_${yearShort}`;

  const folderPath = path.join(
    `${UPLOAD_DIR}/${process.env.IMG_LOC}`,
    folderName,
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const cleanName = file.name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "");

  const fileName = Date.now() + "_" + cleanName;

  const filePath = path.join(folderPath, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const fileUrl = `${BASE_URL}${process.env.IMG_LOC}/${folderName}/${fileName}`;

  return {
    fileName,
    url: fileUrl,
    folderName,
  };
};

const processExcelAndSaveRecipients = async (file, campaignId) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (!data || data.length === 0) return;

  const values = [];
  const placeholders = [];

  data.forEach((row) => {
    const email = row.email || row.Email || row.EMAIL;
    if (!email) return;

    const idx = values.length;
    values.push(campaignId, email);
    placeholders.push(`($${idx + 1}, $${idx + 2}, 0, NOW())`);
  });

  if (values.length === 0) return;

  await queryWithRetry(
    `INSERT INTO ${TABLE_LIST.CAMPAIGNSRECIPIENTS} 
     (campaign_id, email, status, created_at)
     VALUES ${placeholders.join(",")}`,
    values,
  );
};

export const addCampaign = async (formData) => {
  try {
    const session = await getServerSession(options);
    if (!session) return { success: false, msg: "Unauthorized" };

    const sender_id = formData.get("senderId");
    const subject = formData.get("subject");
    const body = formData.get("body");
    const schedule_at = formData.get("date");

    const file = formData.get("file");
    const image = formData.get("image");

    if (!file || file.size === 0) {
      return { success: false, msg: "File required" };
    }

    const fileUpload = await saveFileLocal(file);
    const imageUpload = await saveFileLocal(image);

    let finalBody = body || "";

    if (imageUpload?.url) {
      finalBody += `<div style="font-family:Arial,sans-serif;">

    <!-- Campaign Image Section -->
    <div style="padding:15px 20px;text-align:center;">
      <a href="https://www.tenderbharo.com" target="_blank">
        <img src="${imageUpload.url}" style="max-width:600px;width:100%;height:auto;" />
      </a>
    </div>

    <!-- Signature Section -->
   <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #333;">
  <tr>
    <td style="padding-right: 20px; vertical-align: top; text-align: center;">
      
      <div style="font-size: 32px; font-weight: 900; letter-spacing: 2px; color: #000;">
       <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4wwNvB_d51SUdyGvXSKMtkIlIS6Co4C4NJ3lz1sUV_pSF4N9uLc-2pUfDw1k2T4CrtE7RegPz_MgXKu" style="width:200px;height:auto;border-radius:50%;" />
      </div>

      <div style="margin-top: 10px; font-weight: bold; color: #555;">
        Swapnil Chavan
      </div>

      <div style="color: #777;">
        Senior Sales Marketing Manager
      </div>
    </td>

    <!-- Divider -->
    <td style="border-left: 2px solid #999; padding-left: 20px;"></td>

    <!-- Right Section -->
    <td style="padding-left: 20px; vertical-align: top;">
      
      <div><strong>M</strong> +91 8976412888</div>
      <div><strong>M</strong> +91 8976634333</div>
      <div>
        <strong>E</strong> 
        <a href="mailto:swapnil.c@tenderbharo.com" style="color: #1a73e8; text-decoration: none;">
          swapnil.c@tenderbharo.com
        </a>
      </div>

      <div style="margin-top: 10px; font-weight: bold;">
        Tender Bharo Solutions
      </div>

      <div style="color: #555; line-height: 1.4;">
        Unit No. 311, Bldg no. 2, Sec-1,<br>
        Millennium Business Park,<br>
        Mahape 400710
      </div>

      <div style="margin-top: 10px;">
        <a href="https://www.tenderbharo.com" style="color: #1a73e8; text-decoration: none;">
          www.tenderbharo.com
        </a>
      </div>

    </td>
  </tr>
</table>

  </div>`;
    }

    const result = await queryWithRetry(
      `INSERT INTO ${TABLE_LIST.CAMPAIGNS} 
       (sender_id, subject, body, client_file, schedule_at, status, created_at)
       VALUES ($1,$2,$3,$4,$5,0,NOW())
       RETURNING *`,
      [sender_id, subject, finalBody, fileUpload.fileName, schedule_at],
    );

    const campaign = result[0];

    await processExcelAndSaveRecipients(file, campaign.id);

    const filePath = path.join(
      `${UPLOAD_DIR}/${process.env.IMG_LOC}`,
      fileUpload.folderName,
      fileUpload.fileName,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return { success: true, msg: "Campaign added", data: campaign };
  } catch (err) {
    console.error("Campaign add error::", err);
    return { success: false, msg: err.message };
  }
};

export const getCampaignList = async (filters = {}) => {
  try {
    const queryParams = [];
    let paramIndex = 1;

    const perPage = filters?.per_page || 10;
    const pageNo = filters?.page_no || 1;
    const offset = pageNo * perPage - perPage;

    let query = `
      SELECT c.*, s.email as sender_email
      FROM ${TABLE_LIST.CAMPAIGNS} c
      LEFT JOIN tbl_senders s ON s.id = c.sender_id
      WHERE 1=1
    `;

    if (filters?.search) {
      query += ` AND (c.subject ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex})`;
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.id DESC LIMIT ${perPage} OFFSET ${offset}`;

    const data = await queryWithRetry(query, queryParams);

    return {
      success: true,
      list: data,
    };
  } catch (error) {
    return {
      success: false,
      list: [],
      msg: error.message,
    };
  }
};
