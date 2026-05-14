"use server";

import { db } from "@/utils/lib/database";

export async function getAllUserLog() {
  try {
    const result = await db.query(`
      SELECT 
        um.user_name,
        al.module,
        al.action
      FROM tbl_audit_logs al
      JOIN tbl_user_master um
        ON al.user_id = um.user_id
    `);

    const data = result;

    const finalResult = {};
    const allColumns = {};

    data.forEach((row) => {
      const user = row.user_name;
      const module = row.module.toLowerCase().replace(/\s+/g, "");
      const action = row.action.toLowerCase();
      const col = module + "_" + action;

      allColumns[col] = true;

      if (!finalResult[user]) {
        finalResult[user] = {};
      }

      if (!finalResult[user][col]) {
        finalResult[user][col] = 0;
      }

      finalResult[user][col]++;
    });

    const formatted = Object.keys(finalResult).map((user) => {
      return {
        user_name: user,
        ...finalResult[user],
      };
    });

    return {
      success: true,
      list: formatted,
      columns: Object.keys(allColumns),
    };
  } catch (error) {
    console.error("fetch Logs Error:", error);
    return { success: false, msg: "Error" };
  }
}

export async function getUserWiseLog(payload) {
  try {
    const { user_id, from_date, to_date } = payload;

    const values = [user_id];
    let index = 2;

    let condition = `WHERE al.user_id = $1`;

    condition += ` AND al.module NOT IN ('role', 'reset_password', 'user')`;

    if (from_date && to_date) {
      condition += ` AND DATE(al.inserted_date) BETWEEN $${index} AND $${index + 1}`;
      values.push(from_date, to_date);
      index += 2;
    }

    const result = await db.query(
      `
      SELECT 
        al.module,
        al.action,
        um.user_name
      FROM tbl_audit_logs al
      JOIN tbl_user_master um
        ON al.user_id = um.user_id
      ${condition}
      `,
      values,
    );

    const rows = result?.rows || result || [];

    const finalResult = {};
    const actionsSet = {};

    rows.forEach((row) => {
      const module = row.module;
      const action = row.action.toLowerCase();

      actionsSet[action] = true;

      if (!finalResult[module]) {
        finalResult[module] = {};
      }

      if (!finalResult[module][action]) {
        finalResult[module][action] = 0;
      }

      finalResult[module][action]++;
    });

    const formatted = Object.keys(finalResult).map((module) => ({
      module,
      ...finalResult[module],
    }));

    return {
      success: true,
      list: formatted,
      actions: Object.keys(actionsSet),
      user_name: rows[0]?.user_name || "",
    };
  } catch (error) {
    console.error("fetch Logs Error:", error);
    return { success: false, msg: "Error" };
  }
}

export async function getUserList() {
  try {
    const result = await db.query(`
      SELECT 
        um.user_name,
        um.user_id
      FROM tbl_user_master um
      WHERE um.user_block = 0 AND um.entity_type_id != 1
    `);

    return {
      success: true,
      list: result,
    };
  } catch (error) {
    console.error("fetch user list Error:", error);
    return { success: false, msg: "Error" };
  }
}
