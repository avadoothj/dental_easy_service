import { options } from "@/app/api/auth/[...nextauth]/options";
import { db, dbRead } from "@/utils/lib/database";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { saveLog } from "@/utils/logger";
import messages from "@/utils/messages";
import { getServerSession } from "next-auth";

function normalizeLinkPayload(reqBody = {}) {
  return {
    url_link: reqBody.url_link?.trim() || "",
    country: reqBody.country?.trim() || "",
    groups: reqBody.groups?.trim() || "",
    notice_type: reqBody.notice_type?.trim() || "",
    visit_priority: reqBody.visit_priority?.toString().trim() || "",
    process_type: reqBody.process_type?.trim() || "",
    is_vpn: reqBody.is_vpn === true || reqBody.is_vpn === "true",
    is_action_taken: true,
  };
}

function getStatusFilterValue(status = "") {
  const statusMap = {
    changes: "changes_detected",
    no_change: "no_changes",
  };

  return statusMap[status] || status;
}

function buildWhereClause(conditions = []) {
  if (conditions.length === 0) {
    return "";
  }

  return `WHERE ${conditions.join(" AND ")}`;
}

export async function addSingleLink(reqBody) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const payload = normalizeLinkPayload(reqBody);
    const urlLink = payload.url_link;

    const existingLink = await db.query(
      `SELECT id FROM ${TABLE_LIST.ADD_LINK} WHERE url_link = $1 LIMIT 1`,
      [urlLink],
    );

    if (existingLink.rowCount > 0) {
      return {
        success: false,
        msg: messages.URL_LINK_ALREADY_EXISTS,
      };
    }
    const insertQuery = queryGenerator.generateInsertQuery(
      payload,
      TABLE_LIST.ADD_LINK,
      "id",
    );

    const result = await db.query(insertQuery);

    saveLog({
      module: "site_visit",
      action: "add",
      item_id: result[0].id,
      user_id,
      payload: payload,
    });

    return {
      success: true,
      msg: "Link added successfully",
    };
  } catch (error) {
    console.error("Error in addSingleLink:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function updateSingleLink(id, reqBody) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const linkId = Number(id);
    const payload = normalizeLinkPayload(reqBody);

    if (!linkId) {
      return {
        success: false,
        msg: "Invalid link id",
      };
    }

    const existingLink = await db.query(
      `SELECT id FROM ${TABLE_LIST.ADD_LINK} WHERE id = $1 LIMIT 1`,
      [linkId],
    );

    if (existingLink.rowCount === 0) {
      return {
        success: false,
        msg: "Record not found",
      };
    }

    const duplicateLink = await db.query(
      `SELECT id FROM ${TABLE_LIST.ADD_LINK} WHERE url_link = $1 AND id != $2 LIMIT 1`,
      [payload.url_link, linkId],
    );

    if (duplicateLink.rowCount > 0) {
      return {
        success: false,
        msg: messages.URL_LINK_ALREADY_EXISTS,
      };
    }

    await db.query(
      queryGenerator.generateUpdateQuery(
        payload,
        { id: linkId },
        TABLE_LIST.ADD_LINK,
      ),
    );

    saveLog({
      module: "site_visit",
      action: "edit",
      item_id: linkId,
      user_id,
      payload,
    });

    return {
      success: true,
      msg: "Link updated successfully",
    };
  } catch (error) {
    console.error("Error in updateSingleLink:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function addBulkLinks(rows = []) {
  return new Promise((resolve, reject) => {
    const normalizedRows = rows
      .map((row) => normalizeLinkPayload(row))
      .filter((row) => row.url_link);

    if (normalizedRows.length === 0) {
      resolve({
        success: false,
        msg: "No valid links found for bulk insert",
      });
      return;
    }

    const uniqueRows = [];
    const seenUrls = new Set();
    let duplicateInPayloadCount = 0;

    normalizedRows.forEach((row) => {
      if (seenUrls.has(row.url_link)) {
        duplicateInPayloadCount += 1;
        return;
      }

      seenUrls.add(row.url_link);
      uniqueRows.push(row);
    });

    const urlLinks = uniqueRows.map((row) => row.url_link);

    db.tx(async (transaction) => {
      const existingRows = await transaction.query(
        `SELECT url_link FROM ${TABLE_LIST.ADD_LINK} WHERE url_link = ANY($1)`,
        [urlLinks],
      );

      const existingUrlSet = new Set(existingRows.map((row) => row.url_link));
      const insertableRows = uniqueRows.filter(
        (row) => !existingUrlSet.has(row.url_link),
      );

      for (const row of insertableRows) {
        await transaction.query(
          queryGenerator.generateInsertQuery(row, TABLE_LIST.ADD_LINK),
        );
      }

      return {
        success: true,
        msg: "Bulk links processed successfully",
        insertedCount: insertableRows.length,
        skippedExistingCount: existingUrlSet.size,
        skippedDuplicateCount: duplicateInPayloadCount,
        totalReceivedCount: rows.length,
      };
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject("addBulkLinks: " + error));
  });
}

function buildPagedResult(
  listQuery,
  countQuery,
  queryParams = [],
  payload = {},
) {
  const pageNo = Number(payload.page_no || 1);
  const perPage = Number(payload.per_page || 10);
  const offset = (pageNo - 1) * perPage;

  return Promise.all([
    db.query(
      `${listQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
      [...queryParams, perPage, offset],
    ),
    db.one(countQuery, queryParams),
  ]).then(([list, count]) => ({
    success: true,
    list,
    total: Number(count.count || 0),
    filter: Number(count.count || 0),
  }));
}

export async function getLinkList(payload = {}) {
  const search = payload.search?.trim();
  const status = getStatusFilterValue(payload.status);
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`url_link ILIKE $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = buildWhereClause(conditions);

  return new Promise((resolve, reject) => {
    buildPagedResult(
      `
        SELECT id, url_link, country, groups, notice_type, visit_priority, process_type, is_vpn,last_visited_date
        FROM ${TABLE_LIST.ADD_LINK}
        ${whereClause}
        ORDER BY id DESC
      `,
      `
        SELECT COUNT(*) AS count
        FROM ${TABLE_LIST.ADD_LINK}
        ${whereClause}
      `,
      params,
      payload,
    )
      .then((response) => resolve(response))
      .catch((error) => reject("getLinkList: " + error));
  });
}

export async function todayVisitedList(payload = {}) {
  return new Promise((resolve, reject) => {
    payload.per_page = payload.per_page ?? 10;
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `
      SELECT 
        al.id,
        al.url_link, 
        al.country, 
        al.groups, 
        al.notice_type, 
        al.visit_priority, 
        al.process_type, 
        al.is_vpn, 
        al.last_visited_date,

        COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', sau.id,
              'user_id', sau.user_id,
              'user_name', um.user_name,
              'login_id', um.login_id,
              'comment', sau.comment,
              'created_at', sau.created_at
            )
            ORDER BY sau.created_at DESC
          ) FILTER (WHERE sau.id IS NOT NULL),
          '[]'::jsonb
        ) AS comment_list
    `;

    let mainQuery = `
      FROM ${TABLE_LIST.ADD_LINK} al

      LEFT JOIN LATERAL (
        SELECT *
        FROM ${TABLE_LIST.SITE_VISIT_ACTION_USER} sau
        WHERE sau.link_id = al.id
          AND DATE(sau.created_at) = CURRENT_DATE
          ${payload.userId ? `AND sau.user_id = ${payload.userId}` : ""}
        ORDER BY sau.created_at DESC
        LIMIT 5
      ) sau ON true

      LEFT JOIN ${TABLE_LIST.USER_MASTER} um 
        ON sau.user_id = um.user_id
    `;

    let conditions = [];

    if (payload.search) {
      const search = payload.search.trim().replace(/'/g, "''");
      conditions.push(`(
        COALESCE(al.url_link, '') ILIKE '%${search}%'
        OR COALESCE(al.groups, '') ILIKE '%${search}%'
      )`);
    }

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let groupByQuery = `
      GROUP BY
        al.id,
        al.url_link,
        al.country,
        al.groups,
        al.notice_type,
        al.visit_priority,
        al.process_type,
        al.is_vpn,
        al.last_visited_date
    `;

    let sortLimitQuery = `
      ORDER BY al.id DESC 
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const finalQuery =
      selectQuery + mainQuery + filterQuery + groupByQuery + sortLimitQuery;

    dbRead
      .query(finalQuery)
      .then(function (result) {
        const countQuery = "SELECT COUNT(1) as count ";
        const countMainQuery = `FROM ${TABLE_LIST.ADD_LINK} al`;

        const totalCountQuery = countQuery + countMainQuery;
        const filterCountQuery = countQuery + countMainQuery + filterQuery;

        if (payload.page_no == 1 && filterQuery !== "") {
          Promise.all([
            dbRead.query(totalCountQuery),
            dbRead.query(filterCountQuery),
          ])
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
            .query(totalCountQuery)
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

export async function getTodayVisitedList(payload = {}) {
  const search = payload.search?.trim();
  const status = getStatusFilterValue(payload.status);
  const userId = Number(payload.userId || payload.user_id || 0);
  const params = [];
  const conditions = [`DATE(site_visit.created_at) = CURRENT_DATE`];

  if (userId > 0) {
    params.push(userId);
    conditions.push(`site_visit.user_id = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`links.url_link ILIKE $${params.length}`);
  }

  if (status && status !== "today") {
    params.push(status);
    conditions.push(`links.status = $${params.length}`);
  }

  const whereClause = buildWhereClause(conditions);

  return new Promise((resolve, reject) => {
    buildPagedResult(
      `
        SELECT
          site_visit.id,
          site_visit.link_id,
          site_visit.comment,
          links.url_link,
          links.country,
          links.groups,
          links.notice_type,
          links.visit_priority,
          links.process_type,
          links.is_vpn
        FROM ${TABLE_LIST.SITE_VISIT_ACTION_USER} site_visit
        LEFT JOIN ${TABLE_LIST.ADD_LINK} links ON links.id = site_visit.link_id
        ${whereClause}
        ORDER BY site_visit.id DESC
      `,
      `
        SELECT COUNT(*) AS count
        FROM ${TABLE_LIST.SITE_VISIT_ACTION_USER} site_visit
        LEFT JOIN ${TABLE_LIST.ADD_LINK} links ON links.id = site_visit.link_id
        ${whereClause}
      `,
      params,
      payload,
    )
      .then((response) => resolve(response))
      .catch((error) => reject("getTodayVisitedList: " + error));
  });
}

export async function getAllRecordCount() {
  return new Promise((resolve, reject) => {
    Promise.all([
      db.one(`SELECT COUNT(*) AS count FROM ${TABLE_LIST.ADD_LINK}`),
      db.one(
        `SELECT COUNT(*) AS count FROM ${TABLE_LIST.ADD_LINK} WHERE status = 'pending'`,
      ),
    ])
      .then(([linkCount, pendingCount]) =>
        resolve({
          success: true,
          totalUrl: Number(linkCount.count || 0),
          pendingUrl: Number(pendingCount.count || 0),
        }),
      )
      .catch((error) => reject("getAllRecordCount: " + error));
  });
}

export async function editPendingSite(data) {
  return new Promise((resolve, reject) => {
    db.tx(async (transaction) => {
      const trimmedComment = data.comment?.trim();
      if (!data.userId || !data.id) {
        return {
          success: false,
          msg: "Pending site details are missing",
        };
      }

      if (!trimmedComment) {
        return {
          success: false,
          msg: "Comment is required",
        };
      }
      await transaction.query(
        queryGenerator.generateInsertQuery(
          {
            link_id: data.id,
            user_id: data.userId,
            comment: trimmedComment,
            created_at: new Date(),
          },
          TABLE_LIST.SITE_VISIT_ACTION_USER,
        ),
      );
      await transaction.query(
        queryGenerator.generateUpdateQuery(
          {
            status: "checked",
            is_action_taken: true,
          },
          { id: data.id },
          TABLE_LIST.ADD_LINK,
        ),
      );

      saveLog({
        module: "site_visit",
        action: "visit",
        item_id: data.id,
        user_id: data.userId,
        payload: data,
      });

      return {
        success: true,
        msg: "Pending site added successfully",
      };
    })
      .then((response) => resolve(response))
      .catch((error) => reject("editPendingSite: " + error));
  });
}

export async function list(payload = {}) {
  return new Promise((resolve, reject) => {
    payload.per_page = payload.per_page ?? 1;
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `
      SELECT
        al.id,
        al.url_link,
        al.country,
        al.groups,
        al.notice_type,
        al.visit_priority,
        al.process_type,
        al.is_vpn,
        al.last_visited_date,

        COUNT(sau.user_id) AS comment_user_count,

        COALESCE(
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'id', sau.id,
              'user_id', sau.user_id,
              'user_name', um.user_name,
              'login_id', um.login_id,
              'comment', sau.comment,
              'created_at', sau.created_at
            )
            ORDER BY sau.created_at DESC
          ) FILTER (WHERE sau.id IS NOT NULL),
          '[]'::jsonb
        ) AS comment_list
    `;

    let mainQuery = `
      FROM ${TABLE_LIST.ADD_LINK} al

      LEFT JOIN LATERAL (
        SELECT *
        FROM ${TABLE_LIST.SITE_VISIT_ACTION_USER} sau
        WHERE sau.link_id = al.id
        ORDER BY sau.created_at DESC
        LIMIT 5
      ) sau ON true

      LEFT JOIN ${TABLE_LIST.USER_MASTER} um
        ON sau.user_id = um.user_id
    `;

    let conditions = [];

    if (payload.search) {
      const search = payload.search.trim().replace(/'/g, "''");
      conditions.push(`(
        COALESCE(al.url_link, '') ILIKE '%${search}%'
        OR COALESCE(al.groups, '') ILIKE '%${search}%'
      )`);
    }

    if (payload.status) {
      const status = getStatusFilterValue(payload.status);
      conditions.push(`al.status = '${status}'`);
    }

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let groupByQuery = `
      GROUP BY
        al.id,
        al.url_link,
        al.country,
        al.groups,
        al.notice_type,
        al.visit_priority,
        al.process_type,
        al.is_vpn,
        al.last_visited_date
    `;

    let sortLimitQuery = ` ORDER BY al.id DESC LIMIT ${perPage} OFFSET ${offset}`;

    const finalQuery =
      selectQuery + mainQuery + filterQuery + groupByQuery + sortLimitQuery;

    dbRead
      .query(finalQuery)
      .then(function (result) {
        const countQuery = "SELECT COUNT(1) as count ";
        const countMainQuery = `FROM ${TABLE_LIST.ADD_LINK} al`;

        const totalCountQuery = countQuery + countMainQuery;
        const filterCountQuery = countQuery + countMainQuery + filterQuery;

        if (payload.page_no == 1 && filterQuery !== "") {
          Promise.all([
            dbRead.query(totalCountQuery),
            dbRead.query(filterCountQuery),
          ])
            .then(function (response) {
              resolve({
                success: true,
                list: result,
                total: response[0][0].count,
                filter: response[1][0].count,
              });
            })
            .catch(function (error) {
              reject("getListCount: " + error);
            });
        } else {
          dbRead
            .query(totalCountQuery)
            .then(function (resultTotal) {
              resolve({
                success: true,
                list: result,
                total: resultTotal[0].count,
              });
            })
            .catch(function (error) {
              reject("listRequest: " + error);
            });
        }
      })
      .catch(function (error) {
        reject("listRequest: " + error);
      });
  });
}

export async function deleteLink(id) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const result = await db.query(
      `DELETE FROM ${TABLE_LIST.ADD_LINK} WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      return {
        success: false,
        msg: "Record not found",
      };
    }

    saveLog({
      module: "site_visit",
      action: "delete",
      item_id: id,
      user_id,
      payload: { id },
    });

    return {
      success: true,
      msg: "Link deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteLink:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}
