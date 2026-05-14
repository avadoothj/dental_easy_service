"use server";

import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { dbRead, queryWithRetry } from "@/utils/lib/database";
import { getMainTenderCollection } from "@/utils/lib/mongodb";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { sendMail } from "@/utils/mailer";
import messages from "@/utils/messages";
import { backupAndDeleteFromS3, uploadToS3 } from "@/utils/s3Update";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { saveLog } from "@/utils/logger";
const { ObjectId } = require("mongodb");

const ADMIN_ROLE_ID = 1;
const NULLABLE_DATE_FIELDS = [
  "tender_start_date",
  "tender_publishing_date",
  "tender_end_date",
];
const USER_TENDER_STATUS_MAP = {
  draft: "draft",
  pendingforapproval: "pendingForApproval",
};

const extractTenderPayload = async (tenderData) => {
  const uploadedDocs = [];
  const payload = Object.fromEntries(tenderData.entries());
  const documents = tenderData.getAll("document");

  if (documents.length > 0) {
    for (const file of documents) {
      const uploaded = await uploadToS3(file);

      uploadedDocs.push({
        type: "uploaded_document",
        title: file.name,
        original_url: null,
        s3_path: uploaded.url,
        uploaded_at: new Date(),
      });
    }
  }

  return {
    payload,
    uploadedDocs,
  };
};

const normalizeTenderPayload = (payload) => {
  const normalizedPayload = { ...payload };

  NULLABLE_DATE_FIELDS.forEach((field) => {
    if (normalizedPayload[field] === "") {
      normalizedPayload[field] = null;
      return;
    }

    if (normalizedPayload[field]) {
      normalizedPayload[field] = new Date(
        `${normalizedPayload[field]}T00:00:00.000Z`,
      ).toISOString();
    }
  });

  return normalizedPayload;
};

const normalizeStoredDocuments = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse tender documents:", error);
      return [];
    }
  }

  return [];
};

const normalizeStoredRequiredDocuments = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse required documents:", error);
      return [];
    }
  }

  return [];
};

const getDeletedDocuments = (
  existingDocuments = [],
  retainedDocuments = [],
) => {
  const retainedPaths = new Set(
    retainedDocuments.map((document) => document?.s3_path).filter(Boolean),
  );

  return existingDocuments.filter((document) => {
    const path = document?.s3_path;
    return path && !retainedPaths.has(path);
  });
};

const normalizeUserTenderStatus = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();
  return USER_TENDER_STATUS_MAP[normalizedStatus] || "draft";
};

const getSessionEmail = (session) =>
  String(
    session?.user?.user_email ||
      session?.user?.email ||
      session?.user?.login_id ||
      "",
  ).trim();

const ensureRequiredDocumentsColumn = async () => {
  await queryWithRetry(
    `ALTER TABLE ${TABLE_LIST.ADD_TENDER} ADD COLUMN IF NOT EXISTS required_documents JSON NULL`,
  );
};

const ensureSlugColumn = async () => {
  await queryWithRetry(
    `ALTER TABLE ${TABLE_LIST.ADD_TENDER} ADD COLUMN IF NOT EXISTS slug TEXT NULL`,
  );
};

const getAdminEmails = async () => {
  const rows = await queryWithRetry(
    `SELECT email FROM ${TABLE_LIST.USER_MASTER}
     WHERE role_id = $1
       AND user_block = 0
       AND COALESCE(email, '') != ''`,
    [ADMIN_ROLE_ID],
  );

  return rows.map((row) => row.email).filter(Boolean);
};

const getTebNumber = async () => {
  const response = await fetch(
    process.env.OPENSEARCH_ENDPOINT + "/id/generate-id",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`TEB number API failed with status ${response.status}`);
  }

  const data = await response.json();
  const tebNumber = data?.tender_id;

  if (!tebNumber) {
    throw new Error("TEB number not found in API response");
  }

  return tebNumber;
};

const sendTenderAddedAdminMail = async ({ adminEmails, tender, createdBy }) => {
  if (!adminEmails.length) {
    return { success: false, skipped: true, reason: "No admin email found" };
  }

  const subject = `New Tender Added: ${tender.tender_title || tender.tender_number}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 16px;">New Tender Added</h2>
      <p>A new tender has been created in Tender Bharo.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_number || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Title</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_title || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organisation</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_organisation || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Main Category</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.main_category || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Sub Category</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.sub_category || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Created By</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${createdBy || "-"}</td></tr>
      </table>
    </div>
  `;

  const textBody = [
    "New Tender Added",
    `Tender Number: ${tender.tender_number || "-"}`,
    `Tender Title: ${tender.tender_title || "-"}`,
    `Organisation: ${tender.tender_organisation || "-"}`,
    `Main Category: ${tender.main_category || "-"}`,
    `Sub Category: ${tender.sub_category || "-"}`,
    `Created By: ${createdBy || "-"}`,
  ].join("\n");

  await sendMail({
    to: adminEmails,
    subject,
    text: textBody,
    html: htmlBody,
  });

  return { success: true };
};

const sendTenderUpdatedAdminMail = async ({
  adminEmails,
  tender,
  updatedBy,
}) => {
  if (!adminEmails.length) {
    return { success: false, skipped: true, reason: "No admin email found" };
  }

  const subject = `Tender Updated: ${tender.tender_title || tender.tender_number}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 16px;">Tender Updated</h2>
      <p>A tender has been updated in Tender Bharo.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_number || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Title</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_title || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organisation</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_organisation || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.status || "draft"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Updated By</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${updatedBy || "-"}</td></tr>
      </table>
    </div>
  `;

  const textBody = [
    "Tender Updated",
    `Tender Number: ${tender.tender_number || "-"}`,
    `Tender Title: ${tender.tender_title || "-"}`,
    `Organisation: ${tender.tender_organisation || "-"}`,
    `Status: ${tender.status || "draft"}`,
    `Updated By: ${updatedBy || "-"}`,
  ].join("\n");

  await sendMail({
    to: adminEmails,
    subject,
    text: textBody,
    html: htmlBody,
  });

  return { success: true };
};

const sendTenderStatusMailToUser = async ({
  to,
  tender,
  action,
  rejectionReason = "",
  from,
}) => {
  if (!to) {
    return { success: false, skipped: true, reason: "User email not found" };
  }

  const statusLabel = action === "published" ? "Published" : "Rejected";
  const subject = `Tender ${statusLabel}: ${tender.tender_title || tender.tender_number}`;
  const rejectionMarkup =
    action === "rejected"
      ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Reason</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${rejectionReason || "-"}</td></tr>`
      : "";

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 16px;">Tender ${statusLabel}</h2>
      <p>Your tender has been ${action} in Tender Bharo.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_number || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender Title</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_title || "-"}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organisation</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${tender.tender_organisation || "-"}</td></tr>
        {${tender.url} && <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tender URL</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${tender.url}" target="_blank">${tender.url}</a></td></tr>} 
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${statusLabel}</td></tr>
        ${rejectionMarkup}
      </table>
    </div>
  `;

  const textBody = [
    `Tender ${statusLabel}`,
    `Tender Number: ${tender.tender_number || "-"}`,
    `Tender Title: ${tender.tender_title || "-"}`,
    `Organisation: ${tender.tender_organisation || "-"}`,
    `Status: ${statusLabel}`,
    ...(action === "rejected" ? [`Reason: ${rejectionReason || "-"}`] : []),
  ].join("\n");

  await sendMail({
    to,
    from,
    subject,
    text: textBody,
    html: htmlBody,
  });

  return { success: true };
};

export const createTender = async (tenderData, tebNumber) => {
  try {
    const customId = new ObjectId();
    const collection = await getMainTenderCollection();
    await ensureSlugColumn();
    let documents_required_data = [];
    try {
      const parsedDocs = JSON.parse(tenderData.required_documents || "[]");
      documents_required_data = parsedDocs.map((doc) => doc.name);
    } catch (err) {
      console.error("Invalid JSON in required_documents", err);
    }
    function generateSlug(id, title) {
      return (
        `${title.slice(0, 30)}`
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-") +
        "-" +
        id
      );
    }
    const finalPayload = {
      _id: customId,
      teb_number: tebNumber,
      tender_number: tenderData.tender_number,
      tender_title: tenderData.tender_title,
      slug: generateSlug(customId, tenderData.tender_title),
      tender_description: tenderData.tender_description,
      tender_category: tenderData.tender_category,
      tender_bidding_type: tenderData.tender_bidding_type,
      tender_type: tenderData.tender_type,
      tender_financier: tenderData.tender_financier,
      tender_purchaser_ownership: tenderData.tender_purchaser_name ?? "Public",
      tender_value: tenderData.tender_value ?? "Refer to documents",
      tender_emd: tenderData.tender_emd ?? "Refer to documents",
      tender_document_fees: tenderData.tender_value ?? "Refer to documents",
      tender_city: tenderData.tender_city.toUpperCase(),
      tender_state: tenderData.tender_state.toUpperCase(),
      tender_country: tenderData.tender_country.toUpperCase(),
      tender_pincode: tenderData.tender_pincode ?? "",
      tender_purchaser_address: tenderData.tender_purchaser_address,
      tender_start_date: tenderData.tender_start_date,
      tender_end_date: tenderData.tender_end_date,
      tender_publishing_date: tenderData.tender_publishing_date,
      tender_organisation: tenderData.tender_purchaser_name,
      tender_documents_path: JSON.parse(tenderData.tender_documents_path),
      is_active: true,
      bid_number: tenderData.tender_number,
      source_tag: tenderData.source_tag ?? "",
      tender_ministry_name: tenderData.ministry_name,
      version: 0,
      created_at: new Date(),
      llm_extracted_data: {
        basic_info: {
          generated_title: tenderData.tender_title,
          summary: tenderData.tender_description,
          tender_type: tenderData.tender_type,
          main_category: tenderData.main_category,
          sub_category: tenderData.sub_category,
          total_quantity: 1,
          evaluation_method: tenderData.tender_evaluation,
        },
        organization: {
          ministry: tenderData.ministry_name,
          department: tenderData.department,
          organisation_name: tenderData.tender_purchaser_name,
          office_name: tenderData.tender_contact_person,
        },
        timeline: {
          bid_end_datetime: tenderData.tender_end_date,
          bid_open_datetime: tenderData.tender_start_date,
          bid_offer_validity_days: tenderData.tender_contract_period,
          contract_period: tenderData.tender_contract_period,
          delivery_days: tenderData.tender_contract_period,
        },
        financial: {
          estimated_bid_value: {
            amount: tenderData.tender_value,
            currency: "INR",
            raw_text: tenderData.tender_value,
          },
        },
        eligibility: {
          documents_required: documents_required_data,
          technical_documents_required: null,
        },
      },
    };
    const existing = await queryWithRetry(
      `SELECT id FROM ${TABLE_LIST.ADD_TENDER} WHERE teb_number = $1 LIMIT 1`,
      [tebNumber],
    );

    if (existing.length > 0) {
      await queryWithRetry(
        `UPDATE ${TABLE_LIST.ADD_TENDER} SET slug = $1 WHERE id = $2`,
        [finalPayload.slug, existing[0].id],
      );
    }

    const result = await collection.insertOne(finalPayload);
    try {
      await axios.post(
        process.env.OPENSEARCH_ENDPOINT + "/tender/update",
        {
          object_id: String(result.insertedId),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );
    } catch (err) {
      console.error(
        "❌ OpenSearch indexing failed:",
        err?.response?.data || err.message,
      );
    }
    return {
      success: true,
      id: result.insertedId,
    };
  } catch (error) {
    console.error("Create Tender Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export async function addTender(tenderData) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;
  try {
    const session = await getServerSession(options);
    const payload = normalizeTenderPayload(
      Object.fromEntries(tenderData.entries()),
    );

    await ensureRequiredDocumentsColumn();

    const existing = await queryWithRetry(
      `SELECT tender_number FROM ${TABLE_LIST.ADD_TENDER} WHERE tender_number = $1 LIMIT 1`,
      [payload.tender_number],
    );

    if (existing.length > 0) {
      return {
        success: false,
        msg: messages.TENDER_NUMBER,
      };
    }

    const { uploadedDocs } = await extractTenderPayload(tenderData);
    const tebNumber = await getTebNumber();
    const userSelectedStatus = normalizeUserTenderStatus(payload.status);
    const finalPayload = {
      ...payload,
      id: uuidv4(),
      teb_number: tebNumber,
      tender_bid_type: payload.tender_type,
      required_documents: JSON.stringify(
        normalizeStoredRequiredDocuments(payload.required_documents),
      ),
      tender_documents_path: JSON.stringify(uploadedDocs),
      user_email: session?.user?.user_email || "",
      created_at: new Date(),
      created_by: session?.user?.user_id || "",
      is_active: true,
      status: userSelectedStatus,
    };

    delete finalPayload.document;
    delete finalPayload.retained_documents;
    delete finalPayload.rejection_reason;
    const insertQuery = queryGenerator.generateInsertQuery(
      finalPayload,
      TABLE_LIST.ADD_TENDER,
    );

    let result = await queryWithRetry(insertQuery);

    // if (finalPayload.status === "pendingForApproval") {
    //   try {
    //     const adminEmails = await getAdminEmails();

    //     await sendTenderAddedAdminMail({
    //       adminEmails,
    //       tender: finalPayload,
    //       createdBy: session?.user?.user_email || session?.user?.login_id || "",
    //     });
    //   } catch (mailError) {
    //     console.error("Tender admin notification mail error:", mailError);
    //   }
    // }

    saveLog({
      module: "tender",
      action: "add",
      item_id: result.id,
      user_id,
      payload: finalPayload,
    });

    return { success: true };
  } catch (error) {
    console.error("addTender:", error);
    throw error;
  }
}

export async function getTenderByUserData(params = {}) {
  try {
    const session = await getServerSession(options);
    const isAdmin = Number(session?.user?.role_id) === ADMIN_ROLE_ID;
    const userEmail = (
      params.user_email ||
      session?.user?.user_email ||
      ""
    ).trim();
    const search = params.search?.trim() || "";
    const status = params.status?.trim() || "";
    const pageNo = Number(params.page_no || params.pageNo || 1);
    const perPage = Number(params.per_page || params.perPage || 10);
    const currentPage = Number.isNaN(pageNo) || pageNo < 1 ? 1 : pageNo;
    const pageSize = Number.isNaN(perPage) || perPage < 1 ? 10 : perPage;
    const offset = (currentPage - 1) * pageSize;

    if (!isAdmin && !userEmail) {
      return {
        success: false,
        list: [],
        total: 0,
        filter: 0,
        error: "User email not found",
      };
    }

    const conditions = [];
    const queryParams = [];

    if (!isAdmin) {
      queryParams.push(userEmail);
      conditions.push(`user_email = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search}%`);
      const searchParamRef = `$${queryParams.length}`;
      conditions.push(`(
        COALESCE(teb_number, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_number, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_title, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_organisation, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_country, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_state, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_city, '') ILIKE ${searchParamRef}
      )`);
    }

    if (status && status.toLowerCase() !== "all") {
      queryParams.push(status.toLowerCase());
      conditions.push(`LOWER(COALESCE(status, '')) = $${queryParams.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countQuery = `SELECT COUNT(*)::int AS count FROM ${TABLE_LIST.ADD_TENDER} ${whereClause}`;
    const countResult = await queryWithRetry(countQuery, queryParams);
    const total = countResult[0]?.count || 0;

    const listParams = [...queryParams, pageSize, offset];
    const listQuery = `
      SELECT
        id,
        tender_number,
        teb_number,
        tender_title,
        tender_country,
        tender_state,
        tender_city,
        status,
        slug,
        created_at
      FROM ${TABLE_LIST.ADD_TENDER}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `;

    const list = await queryWithRetry(listQuery, listParams);

    const filterCount = currentPage === 1 ? list.length : total;

    return {
      success: true,
      list,
      total,
      filter: total,
      page_no: currentPage,
      per_page: pageSize,
    };
  } catch (error) {
    console.error("getTenderByUserData:", error);
    return {
      success: false,
      list: [],
      total: 0,
      filter: 0,
      error: error.message,
    };
  }
}

export async function tenderData(payload = {}) {
  return new Promise(async (resolve, reject) => {
    const session = await getServerSession(options);
    let userEmail = (
      payload.user_email ||
      session?.user?.user_email ||
      ""
    ).trim();
    let isAdmin = Number(session?.user?.role_id) === ADMIN_ROLE_ID;
    if (!userEmail) {
      return {
        success: false,
        list: [],
        total: 0,
        filter: 0,
        error: "User email not found",
      };
    }
    payload.per_page = payload.per_page ?? 10;
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `SELECT t.id,t.teb_number,t.tender_number,t.tender_title,t.tender_country,t.tender_state,t.tender_city,t.status,t.slug,GREATEST(
    created_at,
    updated_at,
    rejected_at,
    ads_created_on
  ) AS last_action `;
    //  let selectQuery = `SELECT t.id,t.teb_number,t.tender_number,t.tender_title,t.tender_country,t.tender_state,t.tender_city,t.status,t.slug,t.created_at `;
    let mainQuery = `FROM ${TABLE_LIST.ADD_TENDER} t`;

    let conditions = [];

    if (payload.search) {
      const searchParamRef = payload.search.trim();
      conditions.push(`(
        COALESCE(t.teb_number, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_number, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_title, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_organisation, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_country, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_state, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_city, '') ILIKE '${searchParamRef}'
      )`);
    }

    // if (!isAdmin) {
    //   conditions.push(`t.user_email = '${userEmail}' ${payload.status === "" ? "OR t.status = 'filtered'" : `OR t.status = '${payload.status}'`}`);
    // }
    if (!isAdmin) {
      if (payload.status === "filtered") {
        conditions.push(`t.status = 'filtered'`);
      } else if (payload.status === "") {
        conditions.push(
          `t.user_email = '${userEmail}' OR t.status = 'filtered'`,
        );
      } else {
        conditions.push(
          `t.user_email = '${userEmail}' AND t.status = '${payload.status}'`,
        );
      }
    }

    // if (payload.status && payload.status.toLowerCase() !== "all") {
    //   const status = payload.status.trim();
    //   conditions.push(`t.status = '${status.toLowerCase()}'`);
    // }

    if (payload.userId) {
      conditions.push(`t.user_id = ${payload.userId}`);
    }

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let sortLimitQuery = `
      ORDER BY GREATEST(
        t.created_at,
        t.updated_at,
        t.rejected_at,
        ads_created_on
        ) DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    //  let sortLimitQuery = `
    //   ORDER BY t.created_at DESC
    //   LIMIT ${perPage} OFFSET ${offset}
    // `;

    const finalQuery = selectQuery + mainQuery + filterQuery + sortLimitQuery;

    dbRead
      .query(finalQuery)
      .then(function (result) {
        const countQuery = "SELECT COUNT(1) as count ";

        const totalCount = countQuery + mainQuery;
        const filterCount = countQuery + mainQuery + filterQuery;

        if (payload.page_no == 1 && filterQuery !== "") {
          Promise.all([dbRead.query(totalCount), dbRead.query(filterCount)])
            .then(function (response) {
              resolve({
                success: true,
                list: result,
                total: response[0][0].count,
                filter: response[1][0].count,
              });
            })
            .catch(function (error) {
              reject(new Error("getListCount: " + error.message));
            });
        } else {
          dbRead
            .query(totalCount)
            .then(function (resultTotal) {
              resolve({
                success: true,
                list: result,
                total: resultTotal[0].count,
              });
            })
            .catch(function (error) {
              reject(new Error("listRequest: " + error.message));
            });
        }
      })
      .catch(function (error) {
        reject(new Error("listRequest: " + error.message));
      });
  });
}

export async function getTenderById(id) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Tender id is required",
      };
    }

    const data = await queryWithRetry(
      `
      SELECT 
    t.*,
    COALESCE(r.rejection_details, '[]'::json) AS rejection_details
FROM ${TABLE_LIST.ADD_TENDER} t
LEFT JOIN (
    SELECT 
        r.tender_id,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'user_id', r.user_id,
                'username', u.user_name,
                'reject_reason', r.reject_reason,
                'created_at', r.created_at
            )
            ORDER BY r.created_at DESC
        ) AS rejection_details
    FROM ${TABLE_LIST.TENDER_LIST_USER_ACTION} r
    LEFT JOIN ${TABLE_LIST.USER_MASTER} u 
        ON u.user_id = CASE 
            WHEN r.user_id ~ '^[0-9]+$' THEN r.user_id::int
            ELSE NULL
        END
    GROUP BY r.tender_id
) r ON t.id = r.tender_id
WHERE t.id = $1
      `,
      [id],
    );

    // const data = await queryWithRetry(
    //   `SELECT * FROM ${TABLE_LIST.ADD_TENDER} WHERE id = $1`,
    //   [id],
    // );

    return {
      success: true,
      data: data[0]
        ? {
            ...data[0],
            required_documents: normalizeStoredRequiredDocuments(
              data[0].required_documents,
            ),
            tender_documents_path: normalizeStoredDocuments(
              data[0].tender_documents_path,
            ),
          }
        : null,
    };
  } catch (error) {
    console.error("Error in getTenderDetails:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateTenderById(id, tenderData, teb_number) {
  try {
    const session = await getServerSession(options);
    const user_id = session?.user?.user_id || null;

    if (!id) {
      return {
        success: false,
        error: "Tender id is required",
      };
    }

    await ensureRequiredDocumentsColumn();

    const existingRows = await queryWithRetry(
      `SELECT id,tender_documents_path, required_documents, status, user_email, tender_number, tender_title, tender_organisation, slug FROM ${TABLE_LIST.ADD_TENDER} WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (!existingRows.length) {
      return {
        success: false,
        error: "Tender not found",
      };
    }

    const payload = normalizeTenderPayload(
      Object.fromEntries(tenderData.entries()),
    );

    // const duplicateRows = await queryWithRetry(
    //   `SELECT id FROM ${TABLE_LIST.ADD_TENDER} WHERE tender_number = $1 AND id != $2 LIMIT 1`,
    //   [payload.tender_number, id],
    // );

    // if (duplicateRows.length > 0) {
    //   return {
    //     success: false,
    //     msg: messages.TENDER_NUMBER,
    //   };
    // }

    const { uploadedDocs } = await extractTenderPayload(tenderData);
    const retainedDocuments = normalizeStoredDocuments(
      payload?.retained_documents || existingRows[0]?.tender_documents_path,
    );
    const deletedDocuments = getDeletedDocuments(
      normalizeStoredDocuments(existingRows[0]?.tender_documents_path),
      retainedDocuments,
    );
    const finalDocuments =
      uploadedDocs.length > 0
        ? [...retainedDocuments, ...uploadedDocs]
        : retainedDocuments;

    const finalPayload = {
      ...payload,
      required_documents: JSON.stringify(
        normalizeStoredRequiredDocuments(payload.required_documents),
      ),
      tender_documents_path: JSON.stringify(finalDocuments),
    };

    delete finalPayload.document;
    delete finalPayload.retained_documents;

    const nextStatus = String(payload.status || "").toLowerCase();

    if (["published", "rejected"].includes(nextStatus)) {
      if (nextStatus === "rejected") {
        const rejectionReason = String(payload.rejection_reason || "").trim();
        if (!rejectionReason) {
          return {
            success: false,
            error: "Reject reason is required",
          };
        }
        let actionData = {
          user_id: session?.user?.user_id || session?.user?.email || "",
          tender_id: existingRows[0]?.id || "",
          reject_reason: payload.rejection_reason,
          created_at: new Date(),
        };
        queryGenerator.generateInsertQuery(
          actionData,
          TABLE_LIST.TENDER_LIST_USER_ACTION,
        );
        finalPayload.status = nextStatus;
        finalPayload.rejected_at = new Date();
        finalPayload.rejected_by = session?.user?.user_id || "";
      } else {
        finalPayload.status = nextStatus;
        finalPayload.approved_by = session?.user?.user_id || "";
        finalPayload.approved_on = new Date();
      }
    } else {
      finalPayload.status = normalizeUserTenderStatus(nextStatus);
      finalPayload.updated_at = new Date();
      finalPayload.updated_by = session?.user?.user_id || "";
    }
    delete finalPayload.rejection_reason;
    const updateQuery = queryGenerator.generateUpdateQuery(
      finalPayload,
      { id },
      TABLE_LIST.ADD_TENDER,
    );

    await queryWithRetry(updateQuery);

    if (deletedDocuments.length > 0) {
      await Promise.all(
        deletedDocuments.map(async (document) => {
          try {
            await backupAndDeleteFromS3(document?.s3_path);
          } catch (backupDeleteError) {
            console.error(
              "Failed to backup and delete tender document from S3:",
              document?.s3_path,
              backupDeleteError,
            );
          }
        }),
      );
    }

    const actorEmail = getSessionEmail(session);
    const tenderSummary = {
      tender_number:
        finalPayload.tender_number || existingRows[0]?.tender_number || "",
      tender_title:
        finalPayload.tender_title || existingRows[0]?.tender_title || "",
      tender_organisation:
        finalPayload.tender_organisation ||
        existingRows[0]?.tender_organisation ||
        "",
      status: finalPayload.status || existingRows[0]?.status || "draft",
      url:
        process.env.NEXT_PUBLIC_TENDER_FRONTEND_DOMAIN +
        "/" +
        existingRows[0].slug,
    };

    try {
      if (finalPayload.status === "published") {
        await createTender(finalPayload, teb_number);
        saveLog({
          module: "tender",
          action: "published",
          item_id: teb_number,
          user_id,
          payload: finalPayload,
        });
        // await sendTenderStatusMailToUser({
        //   to: existingRows[0]?.user_email || actorEmail,
        //   tender: tenderSummary,
        //   action: "published",
        //   from: actorEmail || undefined,
        // });
      } else if (finalPayload.status === "rejected") {
        saveLog({
          module: "tender",
          action: "rejected",
          item_id: teb_number,
          user_id,
          payload: finalPayload,
        });
        // await sendTenderStatusMailToUser({
        //   to: existingRows[0]?.user_email || actorEmail,
        //   tender: tenderSummary,
        //   action: "rejected",
        //   rejectionReason: finalPayload.rejection_reason || "",
        //   from: actorEmail || undefined,
        // });
      } else {
        saveLog({
          module: "tender",
          action: "draft",
          item_id: teb_number,
          user_id,
          payload: finalPayload,
        });
      }
    } catch (mailError) {
      console.error("Tender update notification mail error:", mailError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("updateTenderById:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getReqDocument() {
  try {
    const list = await queryWithRetry(
      `SELECT * FROM ${TABLE_LIST.REQUIRED_DOCUMENT} ORDER BY id DESC`,
    );

    return {
      success: true,
      list,
    };
  } catch (error) {
    console.error("Error in getting required document:", error);
    return {
      success: false,
      list: [],
      error: error.message,
    };
  }
}

export async function getTenderApprovalData(params = {}) {
  try {
    const search = params.search?.trim() || "";
    const status = "pendingForApproval";
    const pageNo = Number(params.page_no || params.pageNo || 1);
    const perPage = Number(params.per_page || params.perPage || 10);
    const currentPage = Number.isNaN(pageNo) || pageNo < 1 ? 1 : pageNo;
    const pageSize = Number.isNaN(perPage) || perPage < 1 ? 10 : perPage;
    const offset = (currentPage - 1) * pageSize;

    const conditions = [];
    const queryParams = [];

    if (search) {
      queryParams.push(`%${search}%`);
      const searchParamRef = `$${queryParams.length}`;
      conditions.push(`(
        COALESCE(teb_number, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_number, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_title, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_organisation, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_country, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_state, '') ILIKE ${searchParamRef}
        OR COALESCE(tender_city, '') ILIKE ${searchParamRef}
      )`);
    }

    if (status && status.toLowerCase() !== "all") {
      queryParams.push(status.toLowerCase());
      conditions.push(`LOWER(COALESCE(status, '')) = $${queryParams.length}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countQuery = `SELECT COUNT(*)::int AS count FROM ${TABLE_LIST.ADD_TENDER} ${whereClause}`;
    const countResult = await queryWithRetry(countQuery, queryParams);
    const total = countResult[0]?.count || 0;

    const listParams = [...queryParams, pageSize, offset];
    const listQuery = `
      SELECT
        id,
        tender_number,
        teb_number,
        tender_title,
        tender_country,
        tender_state,
        tender_city,
        status,
        u.user_name,
        created_at
      FROM ${TABLE_LIST.ADD_TENDER} AS t
      LEFT JOIN ${TABLE_LIST.USER_MASTER} AS u ON u.email = t.user_email
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${listParams.length - 1}
      OFFSET $${listParams.length}
    `;
    const list = await queryWithRetry(listQuery, listParams);

    return {
      success: true,
      list,
      total,
      filter: total,
      page_no: currentPage,
      per_page: pageSize,
    };
  } catch (error) {
    console.error("getTenderByUserData:", error);
    return {
      success: false,
      list: [],
      total: 0,
      filter: 0,
      error: error.message,
    };
  }
}

export async function getSourceTag() {
  try {
    const list = await queryWithRetry(
      `SELECT * FROM ${TABLE_LIST.SOURCE_TAG} ORDER BY id DESC`,
    );

    return {
      success: true,
      list,
    };
  } catch (error) {
    console.error("getSourceTag:", error);
    return {
      success: false,
      list: [],
      error: error.message,
    };
  }
}

export async function getFinancierList() {
  try {
    const list = await queryWithRetry(
      `SELECT * FROM ${TABLE_LIST.FINANCIER_LIST} ORDER BY id DESC`,
    );
    return {
      success: true,
      list,
    };
  } catch (error) {
    console.error("getSourceTag:", error);
    return {
      success: false,
      list: [],
      error: error.message,
    };
  }
}

export async function getApprovalData(payload = {}) {
  return new Promise(async (resolve, reject) => {
    payload.per_page = payload.per_page ?? 10;
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `SELECT t.id,t.teb_number,t.tender_number,t.tender_title,t.tender_country,t.tender_state,t.tender_city,t.status,t.slug,t.created_at,u.user_name `;
    let mainQuery = `FROM ${TABLE_LIST.ADD_TENDER} t LEFT JOIN ${TABLE_LIST.USER_MASTER} u ON u.email = t.user_email`;

    let conditions = [];

    if (payload.search) {
      const searchParamRef = payload.search.trim();
      conditions.push(`(
        COALESCE(t.teb_number, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_number, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_title, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_organisation, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_country, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_state, '') ILIKE '${searchParamRef}'
        OR COALESCE(t.tender_city, '') ILIKE '${searchParamRef}'
      )`);
    }

    const status = "pendingForApproval";
    conditions.push(`t.status = '${status}'`);

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let sortLimitQuery = `
      ORDER BY t.id DESC 
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const finalQuery = selectQuery + mainQuery + filterQuery + sortLimitQuery;

    dbRead
      .query(finalQuery)
      .then(function (result) {
        const countQuery = "SELECT COUNT(1) as count ";

        const totalCount = countQuery + mainQuery;
        const filterCount = countQuery + mainQuery + filterQuery;

        if (payload.page_no == 1 && filterQuery !== "") {
          Promise.all([dbRead.query(totalCount), dbRead.query(filterCount)])
            .then(function (response) {
              resolve({
                success: true,
                list: result,
                total: response[0][0].count,
                filter: response[1][0].count,
              });
            })
            .catch(function (error) {
              reject(new Error("getListCount: " + error.message));
            });
        } else {
          dbRead
            .query(totalCount)
            .then(function (resultTotal) {
              resolve({
                success: true,
                list: result,
                total: resultTotal[0].count,
              });
            })
            .catch(function (error) {
              reject(new Error("listRequest: " + error.message));
            });
        }
      })
      .catch(function (error) {
        reject(new Error("listRequest: " + error.message));
      });
  });
}

export async function insertTenderUploadData(tenderData) {
  try {
    const session = await getServerSession(options);
    const collection = await getMainTenderCollection();
    const payload = normalizeTenderPayload(
      Object.fromEntries(tenderData.entries()),
    );
    await ensureRequiredDocumentsColumn();

    const existing = await queryWithRetry(
      `SELECT tender_number FROM ${TABLE_LIST.ADD_TENDER} 
                      WHERE 
                      tender_number = $1 AND
                      tender_purchaser_name = $2 AND
                      tender_end_date = $3 AND
                      tender_title = $4 AND
                      tender_city = $5 AND
                      tender_state = $6
                      LIMIT 1`,
      [
        payload.tender_number,
        payload.tender_purchaser_name,
        payload.tender_end_date,
        payload.tender_title,
        payload.tender_city,
        payload.tender_state,
      ],
    );

    const existMongo = await collection.findOne({
      tender_number: String(payload.tender_number),
      tender_title: String(payload.tender_title),
      tender_purchaser_name: String(payload.tender_purchaser_name),
      tender_end_date: String(payload.tender_end_date),
      tender_city: String(payload.tender_city),
      tender_state: String(payload.tender_state),
    });

    if (existing.length > 0 || existMongo !== null) {
      return {
        success: false,
        msg: messages.TENDER_NUMBER,
      };
    }

    const tebNumber = await getTebNumber();
    const finalPayload = {
      ...payload,
      id: uuidv4(),
      teb_number: tebNumber,
      tender_bid_type: payload.tender_type,
      required_documents: JSON.stringify(
        normalizeStoredRequiredDocuments(payload.required_documents),
      ),
      tender_documents_path:
        payload.tender_documents_path || JSON.stringify([]),
      user_email: session?.user?.user_email,
      created_by: session?.user?.user_id,
      created_at: new Date(),
      approved_by: session?.user?.user_id,
      approved_on: new Date(),
      is_active: true,
      status: "published",
    };

    delete finalPayload.document;
    delete finalPayload.retained_documents;
    const insertQuery = queryGenerator.generateInsertQuery(
      finalPayload,
      TABLE_LIST.ADD_TENDER,
    );
    await queryWithRetry(insertQuery);
    await createTender(finalPayload, tebNumber);
    return { success: true };
  } catch (error) {
    console.error("addTender:", error);
    throw error;
  }
}

export async function addTenderUploadData(tenderData) {
  const session = await getServerSession(options);

  return insertTenderUploadData(tenderData, {
    userEmail: session?.user?.user_email || "",
  });
}

export async function advanceSearchInsertTender(tenderData) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const session = await getServerSession(options);
    const payload = normalizeTenderPayload(
      Object.fromEntries(tenderData.entries()),
    );

    const { uploadedDocs } = await extractTenderPayload(tenderData);
    const tebNumber = await getTebNumber();
    const finalPayload = {
      ...payload,
      id: uuidv4(),
      teb_number: tebNumber,
      tender_documents_path: JSON.stringify(uploadedDocs),
      ads_created_on: new Date(),
      ads_created_by: session?.user?.user_id || "",
      is_active: true,
      status: "filtered",
    };
    delete finalPayload.document;
    const insertQuery = queryGenerator.generateInsertQuery(
      finalPayload,
      TABLE_LIST.ADD_TENDER,
    );

    await queryWithRetry(insertQuery);

    saveLog({
      module: "search_and_upload",
      action: "add",
      item_id: finalPayload.id,
      user_id,
      payload: finalPayload,
    });

    return { success: true };
  } catch (error) {
    console.error("advanceSearchInsertTender:", error.message);
    throw error;
  }
}
