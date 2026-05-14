// // "use server";

// // import { queryGenerator } from "@/utils/lib/queryGenerator";
// // import { TABLE_LIST } from "@/utils/lib/tablesList";
// // import { db, dbRead } from "@/utils/lib/database";
// //
// // import { getServerSession } from "next-auth";
// // import { options } from "@/app/api/auth/[...nextauth]/options";
// // import moment from "moment-timezone";
// // import { DB_TIME_FORMAT } from "@/utils/lib/constants";

// // export const addSender = async (data) => {
// //   const session = await getServerSession(options);
// //   const user_id = session?.user?.user_id || null;

// //   try {
// //     const checkQuery = `SELECT id FROM ${TABLE_LIST.SENDER} WHERE email = $1`;
// //     const existingSender = await db.query(checkQuery, [data.email]);

// //     if (existingSender.length > 0) {
// //       return {
// //         success: false,
// //         msg: "Email already exists",
// //       };
// //     }

// //     const insertQuery = queryGenerator.generateInsertQuery(
// //       data,
// //       TABLE_LIST.SENDER,
// //       "id",
// //     );

// //     const result = await db.query(insertQuery);

// //     if (result.length > 0) {
// //       saveLog({
// //         module: "sender",
// //         action: "add",
// //         item_id: result[0].id,
// //         user_id: user_id,
// //         payload: data,
// //       });

// //       return {
// //         success: true,
// //         msg: `New Sender added`,
// //       };
// //     }
// //   } catch (error) {
// //     console.error("new Sender add error::", error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // export async function getSenderList(filters) {
// //   try {
// //     const queryParams = [];
// //     let paramIndex = 1;
// //     const perPage = filters?.per_page || 10;
// //     const pageNo = filters?.page_no || 1;
// //     const offset = pageNo * perPage - perPage;

// //     let senderListQuery = `SELECT * FROM ${TABLE_LIST.SENDER} WHERE 1=1`;

// //     if (filters?.search) {
// //       senderListQuery += `
// //           AND (
// //             name ILIKE $${paramIndex}
// //             OR email ILIKE $${paramIndex}
// //           )
// //         `;
// //       queryParams.push(`%${filters.search}%`);
// //       paramIndex++;
// //     }

// //     senderListQuery += ` LIMIT ${perPage} OFFSET ${offset}`;

// //     const result = await dbRead.query(senderListQuery, queryParams);

// //     return {
// //       success: true,
// //       list: result,
// //     };
// //   } catch (error) {
// //     console.error("getSenderList error:", error);
// //     return {
// //       success: false,
// //       msg: error.message,
// //     };
// //   }
// // }

// // export async function getSenderDrop() {
// //   try {
// //     let senderListQuery = `SELECT id, email FROM ${TABLE_LIST.SENDER}`;
// //     const result = await dbRead.query(senderListQuery);

// //     return {
// //       success: true,
// //       list: result,
// //     };
// //   } catch (error) {
// //     console.error("getSenderList error:", error);
// //     return {
// //       success: false,
// //       msg: error.message,
// //     };
// //   }
// // }

// // export const updateSender = async (id, data) => {
// //   const session = await getServerSession(options);
// //   const user_id = session?.user?.user_id || null;

// //   try {
// //     if (data.email) {
// //       const checkQuery = `
// //         SELECT id
// //         FROM ${TABLE_LIST.SENDER}
// //         WHERE email = $1 AND id != $2
// //       `;
// //       const existingSender = await dbRead.query(checkQuery, [data.email, id]);

// //       if (existingSender.length > 0) {
// //         return {
// //           success: false,
// //           msg: "Email already exists with another sender",
// //         };
// //       }
// //     }

// //     const selectQuery = `
// //       SELECT *
// //       FROM ${TABLE_LIST.SENDER}
// //       WHERE id = $1
// //     `;
// //     const previousResult = await dbRead.query(selectQuery, [id]);
// //     const previousData = previousResult[0];

// //     const updatePayload = {
// //       ...data,
// //       updated_at: moment().format(DB_TIME_FORMAT),
// //     };

// //     const updateQuery = queryGenerator.generateUpdateQuery(
// //       updatePayload,
// //       { id: id },
// //       TABLE_LIST.SENDER,
// //     );

// //     await db.none(updateQuery);

// //     saveLog({
// //       module: "sender",
// //       action: "update",
// //       item_id: id,
// //       user_id,
// //       payload: updatePayload,
// //       previous: previousData,
// //     });

// //     return {
// //       success: true,
// //       msg: "Sender updated successfully",
// //     };
// //   } catch (error) {
// //     console.error("updateSender error::", error);
// //     return {
// //       success: false,
// //       msg: "Sender update failed",
// //       error: error.message,
// //     };
// //   }
// // };

// // export const deleteSender = async (id) => {
// //   const session = await getServerSession(options);
// //   const user_id = session?.user?.user_id || null;

// //   try {
// //     const deleteQuery = `DELETE FROM ${TABLE_LIST.SENDER} WHERE id = $1 RETURNING id`;
// //     const result = await db.query(deleteQuery, [id]);

// //     if (result.length > 0) {
// //       saveLog({
// //         module: "sender",
// //         action: "delete",
// //         item_id: id,
// //         user_id: user_id,
// //         payload: { id },
// //       });

// //       return { success: true, msg: "Sender deleted successfully" };
// //     }

// //     return { success: false, msg: "Deletion failed: Sender not found" };
// //   } catch (error) {
// //     console.error("deleteSender error::", error);
// //     return { success: false, error: error.message };
// //   }
// // };
// "use server";

// import { db, dbRead } from "@/utils/lib/database";
// import { TABLE_LIST } from "@/utils/lib/tablesList";
// import { saveLog } from "@/utils/logger";
// import { getServerSession } from "next-auth";
// import { options } from "@/app/api/auth/[...nextauth]/options";
// import moment from "moment-timezone";
// import { DB_TIME_FORMAT } from "@/utils/lib/constants";

// export const addSender = async (data) => {
//   const session = await getServerSession(options);
//   const user_id = session?.user?.user_id || null;

//   try {
//     const check = await dbRead.query(
//       `SELECT id FROM ${TABLE_LIST.SENDER} WHERE email = $1`,
//       [data.email],
//     );

//     if (check.length > 0) {
//       return { success: false, msg: "Email already exists" };
//     }

//     const result = await db.query(
//       `INSERT INTO ${TABLE_LIST.SENDER} (email, app_password)
//        VALUES ($1, $2)
//        RETURNING id`,
//       [data.email, data.app_password],
//     );

//     return { success: true, msg: "Sender added" };
//   } catch (e) {
//     return { success: false, msg: e.message };
//   }
// };

// export const getSenderList = async () => {
//   try {
//     const result = await dbRead.query(
//       `SELECT id, email FROM ${TABLE_LIST.SENDER} ORDER BY id DESC`,
//     );

//     return { success: true, list: result };
//   } catch (e) {
//     return { success: false, msg: e.message };
//   }
// };

// export const getSenderDrop = async () => {
//   try {
//     const result = await dbRead.query(
//       `SELECT id, email FROM ${TABLE_LIST.SENDER}`,
//     );

//     return { success: true, list: result };
//   } catch (e) {
//     return { success: false, msg: e.message };
//   }
// };

// export const updateSender = async (id, data) => {
//   const session = await getServerSession(options);
//   const user_id = session?.user?.user_id || null;

//   try {
//     if (data.email) {
//       const check = await dbRead.query(
//         `SELECT id FROM ${TABLE_LIST.SENDER} WHERE email = $1 AND id != $2`,
//         [data.email, id],
//       );

//       if (check.length > 0) {
//         return { success: false, msg: "Email already exists" };
//       }
//     }

//     const result = await db.query(
//       `UPDATE ${TABLE_LIST.SENDER}
//        SET email = $1,
//            app_password = $2,
//             = $3,
//            updated_at = $4
//        WHERE id = $5
//        RETURNING id`,
//       [
//         data.name,
//         data.email,
//         data.app_password,
//         moment().format(DB_TIME_FORMAT),
//         id,
//       ],
//     );

//     saveLog({
//       module: "sender",
//       action: "update",
//       item_id: id,
//       user_id,
//       payload: data,
//     });

//     return { success: true, msg: "Sender updated" };
//   } catch (e) {
//     return { success: false, msg: e.message };
//   }
// };

// export const deleteSender = async (id) => {
//   const session = await getServerSession(options);
//   const user_id = session?.user?.user_id || null;

//   try {
//     await db.query(`DELETE FROM ${TABLE_LIST.SENDER} WHERE id = $1`, [id]);

//     saveLog({
//       module: "sender",
//       action: "delete",
//       item_id: id,
//       user_id,
//       payload: { id },
//     });

//     return { success: true, msg: "Sender deleted" };
//   } catch (e) {
//     return { success: false, msg: e.message };
//   }
// };
"use server";

import { TABLE_LIST } from "@/utils/lib/tablesList";
import { db, dbRead } from "@/utils/lib/database";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import moment from "moment-timezone";
import { DB_TIME_FORMAT } from "@/utils/lib/constants";
import { saveLog } from "@/utils/logger";

export const addSender = async (data) => {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const checkQuery = `SELECT id FROM ${TABLE_LIST.SENDER} WHERE email = $1`;
    const existing = await dbRead.query(checkQuery, [data.email]);

    if (existing.length > 0) {
      return { success: false, msg: "Email already exists" };
    }

    const insertQuery = `
      INSERT INTO ${TABLE_LIST.SENDER} (email, app_password, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    `;

    const result = await db.query(insertQuery, [data.email, data.app_password]);

    saveLog({
      module: "sender",
      action: "add",
      item_id: result[0].id,
      user_id,
      payload: data,
    });

    return {
      success: true,
      msg: "Sender added",
      id: result[0]?.id,
    };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export async function getSenderList(filters = {}) {
  try {
    const queryParams = [];
    let paramIndex = 1;

    const perPage = filters?.per_page || 10;
    const pageNo = filters?.page_no || 1;
    const offset = pageNo * perPage - perPage;

    let query = `SELECT id, email, created_at FROM ${TABLE_LIST.SENDER} WHERE 1=1`;

    if (filters?.search) {
      query += ` AND email ILIKE $${paramIndex}`;
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` ORDER BY id DESC LIMIT ${perPage} OFFSET ${offset}`;

    const result = await dbRead.query(query, queryParams);

    return {
      success: true,
      list: result,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
}

export async function getSenderDrop() {
  try {
    const result = await dbRead.query(
      `SELECT id, email FROM ${TABLE_LIST.SENDER} ORDER BY id DESC`,
    );

    return {
      success: true,
      list: result,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
}

export const deleteSender = async (id) => {
  try {
    const result = await db.query(
      `DELETE FROM ${TABLE_LIST.SENDER} WHERE id = $1 RETURNING id`,
      [id],
    );

    if (result.length > 0) {
      return { success: true, msg: "Sender deleted" };
    }

    return { success: false, msg: "Sender not found" };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};
