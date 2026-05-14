"use server";
import apiList from "@/utils/apiList";
import { callPostApi } from "@/utils/service";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { db, dbRead } from "@/utils/lib/database";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { encryptPassword, generateRandomString } from "@/utils/lib/functions";
import { saveLog } from "@/utils/logger";
import { sendUserMail } from "@/utils/sendUserMail";

const DEFAULT_SUPER_ADMIN_ROLE = 1;

export async function getResetPassCount(user) {
  try {
    const params = [];

    let countQuery = `select count(1) as count `;
    countQuery += `from ${TABLE_LIST.USER_MASTER} ud `;
    countQuery += `where user_block = 0 and role_id != ${DEFAULT_SUPER_ADMIN_ROLE} `;

    const result = await dbRead.result(countQuery, params);

    return {
      count: result.rows[0]?.count ?? 0,
    };
  } catch (error) {
    console.error("resetPassCountQuery:", error);

    return {
      count: 0,
    };
  }
}

export async function getResetPassList(filters) {
  try {
    const queryParams = [];
    let paramIndex = 1;

    const sortBy = filters?.sort;
    const perPage = filters?.per_page || 10;
    const pageNo = filters?.page_no || 1;
    const offset = pageNo * perPage - perPage;

    let resetPassListQuery = `
      SELECT 
        u.user_id,
        u.login_id,
        u.user_name,
        u.inserted_date,
        u.email,
        u.mobile,
        r.role_name
      FROM ${TABLE_LIST.USER_MASTER} u
      LEFT JOIN ${TABLE_LIST.ROLE_MASTER} r
        ON u.role_id = r.role_id
      WHERE u.user_block = 0
        AND u.role_id != ${DEFAULT_SUPER_ADMIN_ROLE}
    `;

    if (filters?.search) {
      resetPassListQuery += `
        AND (
          u.user_name ILIKE $${paramIndex} 
          OR u.login_id ILIKE $${paramIndex}
          OR r.role_name ILIKE $${paramIndex}
        )
      `;
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    switch (sortBy) {
      case "name_desc":
        resetPassListQuery += ` ORDER BY TRIM(u.user_name) DESC`;
        break;
      case "name_asc":
        resetPassListQuery += ` ORDER BY TRIM(u.user_name) ASC`;
        break;
      case "created_asc":
        resetPassListQuery += ` ORDER BY u.inserted_date ASC`;
        break;
      case "created_desc":
      default:
        resetPassListQuery += ` ORDER BY u.inserted_date DESC`;
        break;
    }

    resetPassListQuery += ` LIMIT ${perPage} OFFSET ${offset}`;

    const result = await dbRead.query(resetPassListQuery, queryParams);

    const list = result.map((x) => ({
      ...x,
      is_primary: false,
    }));

    return { success: true, list };
  } catch (error) {
    console.error("getResetPassList:", error);
    return { success: false, msg: error.message };
  }
}

export async function resetUserPassword(payload) {
  const session = await getServerSession(options);
  const user = session?.user || {};

  try {
    let tokenQuery = `
      SELECT ud.user_id, ud.login_id, ud.email
      FROM ${TABLE_LIST.USER_MASTER} ud
      WHERE ud.user_id = $1
    `;

    const result = await dbRead.query(tokenQuery, [payload.user_id]);

    if (result.length === 0) {
      return { success: false, msg: MESSAGES_LIST.INVALID_ID_PROVIDED };
    }

    const password = generateRandomString(10);
    const encryptedPassword = encryptPassword(password);

    const updateUserQuery = `
      UPDATE ${TABLE_LIST.USER_MASTER}
      SET password = $1,
          last_password_change = NULL,
          auto_logout_date = NOW()
      WHERE user_id = $2
    `;

    await db.none(updateUserQuery, [encryptedPassword, payload.user_id]);

    saveLog({
      module: "reset_password",
      action: "change_password",
      user_id: user.user_id,
      item_id: payload.user_id,
      payload: payload,
    });

    // await sendUserMail(result[0].login_id, "A", false, password);
    await sendUserMail({
      email: result[0].email,
      type: "P",
      value: password,
      stakeHolder: result[0].login_id,
    });

    return { success: true, msg: MESSAGES_LIST.PASSWORD_SENT_VIA_MAIL };
  } catch (error) {
    console.error("resetPassword:", error);
    return { success: false, msg: error.message };
  }
}

export async function regenerateUserToken(payload) {
  return new Promise((resolve, reject) => {
    callPostApi(apiList.resetPassword.regenerateToken, payload)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
