import { db, dbRead } from "@/utils/lib/database";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";

function normalizeProjectPayload(reqBody = {}) {
  return {
    project_name: reqBody.project_name?.trim() || "",
    project_country: reqBody.project_country?.trim() || "",
    project_details: reqBody.project_details?.trim() || "",
    purchaser_name: reqBody.purchaser_name?.trim() || "",
    purchaser_country: reqBody.purchaser_country?.trim() || "",
    purchaser_address: reqBody.purchaser_address?.trim() || "",
    purchaser_email: reqBody.purchaser_email?.trim() || "",
    purchaser_url: reqBody.purchaser_url?.trim() || "",
    project_status: reqBody.project_status?.trim() || "",
    contactor_name: reqBody.contactor_name?.trim() || "",
    project_completion_date: reqBody.project_completion_date || null,
    project_value: reqBody.project_value?.trim() || "",
    project_currency: reqBody.project_currency?.trim() || "",
    financier: reqBody.financier?.trim() || "",
    sector: reqBody.sector?.trim() || "",
    source_website: reqBody.source_website?.trim() || "",
    document: reqBody.document?.trim() || ""
  };
}

function buildWhereClause(conditions = []) {
  if (conditions.length === 0) {
    return "";
  }
  return `WHERE ${conditions.join(" AND ")}`;
}

export async function addProject(reqBody) {
  return new Promise((resolve, reject) => {
    const payload = normalizeProjectPayload(reqBody);
    if (!payload.project_name || !payload.purchaser_name) {
      resolve({ success: false, msg: "Required fields missing" });
      return;
    }

    db.query(
      queryGenerator.generateInsertQuery(payload, TABLE_LIST.PROJECT_LIST),
    )
      .then(() => {
        resolve({ success: true });
      })
      .catch((error) => reject("addProject: " + error));
  });
}

export async function getProjectListData(payload = {}) {
  const search = payload.search?.trim();
  const params = [];
  const conditions = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`project_name ILIKE $${params.length}`);
  }

  const whereClause = buildWhereClause(conditions);

  return new Promise((resolve, reject) => {
    const pageNo = Number(payload.page_no || 1);
    const perPage = Number(payload.per_page || 10);
    const offset = (pageNo - 1) * perPage;

    Promise.all([
      db.query(
        `SELECT * FROM ${TABLE_LIST.PROJECT_LIST} ${whereClause} ORDER BY id DESC LIMIT $${
          params.length + 1
        } OFFSET $${params.length + 2}`,
        [...params, perPage, offset],
      ),
      db.one(`SELECT COUNT(*) AS count FROM ${TABLE_LIST.PROJECT_LIST} ${whereClause}`, params),
    ])
      .then(([list, count]) => {
        const result = {
          success: true,
          list,
          total: Number(count.count || 0),
          filter: Number(count.count || 0),
        };
        resolve(result);
      })
      .catch((error) => {
        console.log("039545 error:", error)
        reject("getTenderList: " + error)
      });
  });
}

export async function projectList(payload = {}) {
  return new Promise((resolve, reject) => {
    payload.per_page = payload.per_page ?? 10; 
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `SELECT * `;

    let mainQuery = `FROM ${TABLE_LIST.PROJECT_LIST} p`;

    let conditions = [];

    if (payload.search) {
      const search = payload.search.trim();
      conditions.push(`p.project_name ILIKE '%${search}%'`);
    }

    if (payload.status) {
      const status = payload.status.trim();
      conditions.push(`p.project_status = '${status}'`);
    }

    if (payload.userId) {
      conditions.push(`p.user_id = ${payload.userId}`);
    }

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let sortLimitQuery = `
      ORDER BY p.id DESC 
      LIMIT ${perPage} OFFSET ${offset}
    `;

    const finalQuery =
      selectQuery + mainQuery + filterQuery + sortLimitQuery;

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
