"use server";

import { db, dbRead } from "@/utils/lib/database";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { saveLog } from "@/utils/logger";

export default async function genLeadLink(reqBody) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  const { name, email, interest, tenderType, keywords, resultLength, expiry } =
    reqBody;

  try {
    const payload = {
      tenderType,
      keywords,
      resultLength,
    };
    const secondsInDay = 86400;
    const expire = Math.floor(Date.now() / 1000) + expiry * secondsInDay;
    const token = jwt.sign(
      {
        exp: expire,
        data: payload,
      },
      process.env.JWT_SECRET_NEW,
      { algorithm: "HS512" },
    );

    const newPayload = {
      token,
      client_name: name,
      client_email: email,
      interest_level: interest,
      tender_types: tenderType,
      keywords,
      result_length: resultLength,
      expires_at: new Date(expire * 1000),
    };

    const insertQuery = queryGenerator.generateInsertQuery(
      newPayload,
      TABLE_LIST.LEAD_GENERATION,
      "id",
    );

    const result = await db.query(insertQuery);

    saveLog({
      module: "lead_api",
      action: "add",
      item_id: result[0].id,
      user_id,
      payload: newPayload,
    });

    return {
      success: true,
      msg: `Link created. It will expire in ${expiry} days.`,
    };
  } catch (error) {
    console.error("genarate link error::", error);
    return { error: error.message };
  }
}

export async function leadList(payload = {}) {
  try {
    const perPage = parseInt(payload.per_page) || 10;
    const pageNo = parseInt(payload.page_no) || 1;
    const offset = (pageNo - 1) * perPage;

    let values = [];
    let index = 1;
    let conditions = [];

    if (payload.search && payload.search.trim() !== "") {
      conditions.push(
        `(client_name ILIKE $${index} OR client_email ILIKE $${index})`,
      );
      values.push(`%${payload.search.trim()}%`);
      index++;
    }

    if (payload.interest) {
      conditions.push(`interest_level = $${index}`);
      values.push(payload.interest);
      index++;
    }

    if (payload.fromDate && payload.toDate) {
      conditions.push(`DATE(created_at) BETWEEN $${index} AND $${index + 1}`);
      values.push(payload.fromDate, payload.toDate);
      index += 2;
    }

    const filterQuery = conditions.length
      ? " WHERE " + conditions.join(" AND ")
      : "";

    const dataQuery = `
      SELECT 
        id, client_name, client_email, interest_level, 
        tender_types, keywords, result_length, 
        expires_at, created_at
      FROM tbl_lead_generation 
      ${filterQuery} 
      ORDER BY id DESC 
      LIMIT $${index} OFFSET $${index + 1}
    `;

    const result = await dbRead.query(dataQuery, [...values, perPage, offset]);
    const list = Array.isArray(result)
      ? Array.isArray(result[0])
        ? result[0]
        : result
      : result?.rows || [];

    const totalRes = await dbRead.query(
      `SELECT COUNT(1) as count FROM tbl_lead_generation`,
    );
    const totalData = Array.isArray(totalRes)
      ? Array.isArray(totalRes[0])
        ? totalRes[0][0]
        : totalRes[0]
      : totalRes?.rows?.[0];
    const totalCount = parseInt(totalData?.count || 0);

    let filterCount = totalCount;
    if (filterQuery) {
      const filterRes = await dbRead.query(
        `SELECT COUNT(1) as count FROM tbl_lead_generation ${filterQuery}`,
        values,
      );
      const filterData = Array.isArray(filterRes)
        ? Array.isArray(filterRes[0])
          ? filterRes[0][0]
          : filterRes[0]
        : filterRes?.rows?.[0];
      filterCount = parseInt(filterData?.count || 0);
    }

    return {
      success: true,
      list: list,
      total: totalCount,
      filter: filterCount,
    };
  } catch (error) {
    console.error("leadList error:", error);
    throw new Error("leadList: " + error.message);
  }
}
