"use server";
import apiList from "@/utils/apiList";
import { callPostApi } from "@/utils/service";
import { getConstant } from "@/utils/utils";
import { db, dbRead, executeQuery } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { DB_TIME_FORMAT } from "@/utils/lib/constants";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

function createFullMenu(menu) {
  const arrayUnique = (array) => {
    return array.filter(function (el, index, arr) {
      return index == arr.indexOf(el);
    });
  };

  const getChildMenus = (parentId = 0) => {
    const temp = menu
      ?.filter((x) => parentId == x.parent_id)
      .map((y) => {
        return {
          menu_id: y.menu_id,
          section_id: y.section_id,
          name: y.name,
          link: y.link,
          image: y.image,
          on_sidebar: y.on_sidebar,
          menus: getChildMenus(y.menu_id),
        };
      });

    return temp;
  };

  const tempMenu = getChildMenus();

  const finalMenu = [];
  arrayUnique(tempMenu.map((x) => x.section_id)).map((sectionId) => {
    finalMenu.push(tempMenu.filter((y) => sectionId == y.section_id));
  });
  return finalMenu;
}

function getIdFromMenu(menu) {
  const menuIds = [];
  menu.map((x) => {
    x.map((y) => {
      menuIds.push(y.menu_id);
      if (y.menus.length > 0) {
        y.menus.map((z) => {
          menuIds.push(z.menu_id);
        });
      }
    });
  });

  return menuIds;
}

function saveLog(data) {
  const {
    module,
    action,
    user_id,
    item_id,
    payload = {},
    source = "web",
    previous = null,
    updated = null,
  } = data;

  const changedData = {};
  if (previous != null) {
    if (
      updated != null &&
      (action == "sync_plan" || action == "sync_plan_bulk")
    ) {
      const result = compareArrays(previous, updated);

      changedData.updated = {};
      changedData.removed = result.onlyInArray1;
      changedData.added = result.onlyInArray2;

      result.inBoth.map((x) => {
        const tempPrev = previous.filter(
          (y) => x.bouquet_code == y.bouquet_code,
        );
        const tempUpdate = updated.filter(
          (y) => x.bouquet_code == y.bouquet_code,
        );

        if (tempPrev.length > 0 && tempUpdate.length > 0) {
          Object.keys(tempPrev[0]).map((y) => {
            if (
              typeof tempPrev[0][y] != "undefined" &&
              tempPrev[0][y] != tempUpdate[0][y]
            ) {
              if (typeof changedData.updated[x.bouquet_code] == "undefined") {
                changedData.updated[x.bouquet_code] = {};
              }

              changedData.updated[x.bouquet_code][y] = {
                previous: tempPrev[0][y],
                changed: tempUpdate[0][y],
              };
            }
          });
        }
      });
    } else {
      Object.keys(payload).map((x) => {
        if (typeof previous[x] != "undefined" && previous[x] != payload[x]) {
          changedData[x] = { previous: previous[x], changed: payload[x] };
        }
      });
    }
  }

  const insertQuery = queryGenerator.generateInsertQuery(
    {
      module: module,
      action: action,
      user_id: user_id,
      item_id: item_id,
      payload: JSON.stringify(payload),
      previous_data: previous != null ? JSON.stringify(previous) : null,
      changed_data: previous != null ? JSON.stringify(changedData) : null,
      source: source.toLowerCase(),
      inserted_date: moment().format(DB_TIME_FORMAT),
    },
    TABLE_LIST.AUDIT_LOGS,
  );

  db.none(insertQuery)
    .then((result) => {})
    .catch((error) => {
      errorLogger("saveLog: " + error);
    });
}

export async function getRolesForTeams() {
  try {
    const session = await getServerSession(options);
    const user = session?.user || {};

    const query = `
      SELECT role_id, entity_type, role_name, permissions
      FROM ${TABLE_LIST.ROLE_MASTER}
      WHERE status = 1 
        AND is_hidden = 0 
      ORDER BY role_name
    `;

    const result = await executeQuery(query);

    return {
      data: result,
    };
  } catch (error) {
    console.error("getRolesForTeams:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
}
export async function getRolesList(user, params = {}) {
  try {
    const filters = {
      page_no: 1,
      per_page: getConstant("ROLE_LIMIT"),
      sort: "created_desc",
      ...params,
    };
    if (user.user_type.toLowerCase() !== "internal") {
      return {
        success: false,
        msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION,
      };
    }

    const perPage = filters.per_page;
    const pageNo = filters.page_no;
    const sortBy = filters.sort;
    const offset = pageNo * perPage - perPage;

    let query = `
      SELECT 
        rd.role_id, 
        rd.role_name AS name, 
        et.id AS cat_id, 
        et.entity_name AS role_type
      FROM ${TABLE_LIST.ROLE_MASTER} rd
      LEFT JOIN ${TABLE_LIST.ENTITY_TYPES} et 
        ON rd.entity_type = et.id
      WHERE rd.status = 1
    `;

    let queryParams = [];
    let index = 1;

    // ✅ Filter: type
    if (filters.type) {
      query += ` AND et.id = $${index}`;
      queryParams.push(filters.type);
      index++;
    }

    // ✅ Filter: search
    if (filters.search) {
      query += ` AND rd.role_name ILIKE $${index}`;
      queryParams.push(`%${filters.search}%`);
      index++;
    }

    // ✅ Sorting
    switch (sortBy) {
      case "name_desc":
        query += ` ORDER BY rd.role_name DESC`;
        break;
      case "name_asc":
        query += ` ORDER BY rd.role_name ASC`;
        break;
      case "created_asc":
        query += ` ORDER BY rd.inserted_date ASC`;
        break;
      case "created_desc":
      default:
        query += ` ORDER BY rd.inserted_date DESC`;
        break;
    }

    // ✅ Pagination
    query += ` LIMIT ${perPage} OFFSET ${offset}`;
    // ✅ Execute query
    const result = await dbRead.query(query, queryParams);

    return {
      success: true,
      list: result,
    };
  } catch (error) {
    console.error("getRolesList Error:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function getRoleDetails(id) {
  try {
    if (!id) {
      return {
        success: false,
        msg: MESSAGES_LIST.INVALID_ID_PROVIDED,
      };
    }

    let query = `
      SELECT 
        role_id,
        role_name AS name,
        permissions,
        entity_type AS role_type,
        inserted_by,
        inserted_date,
        updated_by,
        updated_date
      FROM ${TABLE_LIST.ROLE_MASTER}
      WHERE status = 1 AND role_id = $1
    `;

    const result = await dbRead.query(query, [id]);
    if (result.length > 0) {
      const roleInfo = result[0];

      // ✅ safe JSON parse
      let permissions = [];
      try {
        permissions = roleInfo.permissions
          ? JSON.parse(roleInfo.permissions)
          : [];
      } catch (e) {
        permissions = [];
      }

      roleInfo.permissions = getIdFromMenu(permissions);

      return {
        success: true,
        data: roleInfo,
      };
    } else {
      return {
        success: false,
        msg: MESSAGES_LIST.INVALID_ID_PROVIDED,
      };
    }
  } catch (error) {
    console.error("getRoleDetails Error:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function getRoleCounts() {
  try {
    let query = `
      SELECT COUNT(1) AS count
      FROM ${TABLE_LIST.ROLE_MASTER}
      WHERE status = 1
    `;

    const result = await dbRead.query(query);
    return {
      success: true,
      count: Number(result[0]?.count),
    };
  } catch (error) {
    console.error("getRoleCounts Error:", error);
    return {
      success: false,
      count: 0,
    };
  }
}

// export async function addRole(user, payload) {
//   const roleName = payload.role_name;
//   const operType = payload.role_type;
//   const permissions = payload.permissions;
//   const insertedBy = user.login_id;

//   const selectQuery = `select role_name from ${TABLE_LIST.ROLE_MASTER} where lower(role_name) = $1`;

//   dbRead
//     .query(selectQuery, [roleName.trim().toLowerCase()])
//     .then((result) => {
//       if (result.length == 0) {
//         let menuQuery = `select * from ${TABLE_LIST.MENU_MASTER} `;
//         menuQuery += `where status = 1 and (is_default = 1 or menu_id in (${permissions}) or menu_id in (select parent_id from ${TABLE_LIST.MENU_MASTER} where status = 1 and menu_id in (${permissions}))) `;
//         menuQuery += `order by section_id, parent_id, sort_order`;

//         dbRead
//           .query(menuQuery)
//           .then((result) => {
//             const finalMenu = createFullMenu(result);

//             const insertQuery = `insert INTO ${TABLE_LIST.ROLE_MASTER}
// 							(role_name, entity_type, permissions, inserted_by, inserted_date)
// 							values ($1, $2, $3, $4, $5) RETURNING role_id`;

//             db.one(insertQuery, [
//               roleName.trim(),
//               operType,
//               JSON.stringify(finalMenu),
//               insertedBy,
//               moment().format(DB_TIME_FORMAT),
//             ])
//               .then((insertResult) => {
//                 saveLog({
//                   module: "role",
//                   action: "add",
//                   user_id: user.user_id,
//                   item_id: insertResult.role_id,
//                   payload: payload,
//                 });

//                 return { success: true, msg: MESSAGES_LIST.ROLE_ADDED };
//               })
//               .catch((error) => {
//                 console.error("insertQuery: " + error);
//               });
//           })
//           .catch((error) => {
//             console.error("getMenu: " + error);
//           });
//       } else {
//         return {
//           success: false,
//           msg: MESSAGES_LIST.ROLE_NAME_EXIST,
//         };
//       }
//     })
//     .catch((error) => {
//       console.error("addRole: " + error);
//     });
// }

export async function addRole(user, payload) {
  try {
    const roleName = payload.role_name;
    const operType = payload.role_type;
    const permissions = payload.permissions;
    const insertedBy = user.login_id;

    const selectQuery = `select role_name from ${TABLE_LIST.ROLE_MASTER} where lower(role_name) = $1`;

    const roleCheck = await dbRead.query(selectQuery, [
      roleName.trim().toLowerCase(),
    ]);

    if (roleCheck.length > 0) {
      return {
        success: false,
        msg: MESSAGES_LIST.ROLE_NAME_EXIST,
      };
    }

    let menuQuery = `select * from ${TABLE_LIST.MENU_MASTER} `;
    menuQuery += `where status = 1 and (is_default = 1 or menu_id in (${permissions}) or menu_id in (select parent_id from ${TABLE_LIST.MENU_MASTER} where status = 1 and menu_id in (${permissions}))) `;
    menuQuery += `order by section_id, parent_id, sort_order`;

    const menuResult = await dbRead.query(menuQuery);

    const finalMenu = createFullMenu(menuResult);

    const insertQuery = `insert INTO ${TABLE_LIST.ROLE_MASTER}
      (role_name, entity_type, permissions, inserted_by, inserted_date)
      values ($1, $2, $3, $4, $5) RETURNING role_id`;

    const insertResult = await db.one(insertQuery, [
      roleName.trim(),
      operType,
      JSON.stringify(finalMenu),
      insertedBy,
      moment().format(DB_TIME_FORMAT),
    ]);

    saveLog({
      module: "role",
      action: "add",
      user_id: user.user_id,
      item_id: insertResult.role_id,
      payload: payload,
    });

    return {
      success: true,
      msg: MESSAGES_LIST.ROLE_ADDED,
      role_id: insertResult.role_id,
    };
  } catch (error) {
    console.error("addRole error:", error);

    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function editRole(user, payload) {
  try {
    // ✅ User validation
    if (user?.user_type?.toLowerCase() !== "internal") {
      return {
        success: false,
        msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION,
      };
    }

    if (!payload?.role_id) {
      return {
        success: false,
        msg: MESSAGES_LIST.INVALID_ID_PROVIDED,
      };
    }

    // ✅ Check role exists
    let roleQuery = `
      SELECT role_id, role_name AS name, permissions 
      FROM ${TABLE_LIST.ROLE_MASTER}
      WHERE role_id = $1
    `;

    const roleResult = await dbRead.query(roleQuery, [payload.role_id]);
    const roleRows = roleResult?.rows || roleResult || [];

    if (roleRows.length === 0) {
      return {
        success: false,
        msg: MESSAGES_LIST.INVALID_ID_PROVIDED,
      };
    }

    // ✅ Check duplicate role name
    const checkNameQuery = `
      SELECT role_id 
      FROM ${TABLE_LIST.ROLE_MASTER} 
      WHERE LOWER(role_name) = $1 AND role_id != $2
    `;

    const nameResult = await dbRead.query(checkNameQuery, [
      payload.role_name?.trim().toLowerCase(),
      payload.role_id,
    ]);

    const nameRows = nameResult?.rows || nameResult || [];

    if (nameRows.length > 0) {
      return {
        success: false,
        msg: MESSAGES_LIST.ROLE_NAME_EXIST,
      };
    }

    // ❌ Empty permissions check
    if (!payload.permissions || payload.permissions === "") {
      return {
        success: false,
        msg: MESSAGES_LIST.ROLE_PERMISSION_EMPTY,
      };
    }

    // ✅ Get previous data (for logs)
    const prevResult = await dbRead.query(
      `SELECT role_id, role_name, entity_type AS role_type, permissions 
       FROM ${TABLE_LIST.ROLE_MASTER} 
       WHERE role_id = $1`,
      [payload.role_id],
    );

    const prevRows = prevResult?.rows || prevResult || [];
    let previousData = prevRows[0];

    // ✅ Flatten old permissions
    if (previousData?.permissions) {
      try {
        let temp = [];
        JSON.parse(previousData.permissions).forEach((x) => {
          x.forEach((y) => {
            temp.push(y.menu_id);
            y.menus?.forEach((z) => {
              temp.push(z.menu_id);
            });
          });
        });
        previousData.permissions = temp.join(",");
      } catch {
        previousData.permissions = "";
      }
    }

    // ✅ SAFE permissions parsing
    const ids = payload.permissions
      .split(",")
      .map((x) => Number(x))
      .filter((x) => !isNaN(x));

    if (ids.length === 0) {
      return {
        success: false,
        msg: MESSAGES_LIST.ROLE_PERMISSION_EMPTY,
      };
    }

    // ✅ Safe menu query (NO SQL injection)
    const menuQuery = `
      SELECT * FROM ${TABLE_LIST.MENU_MASTER}
      WHERE status = 1 
      AND (
        is_default = 1 
        OR menu_id = ANY($1)
        OR menu_id IN (
          SELECT parent_id 
          FROM ${TABLE_LIST.MENU_MASTER} 
          WHERE status = 1 AND menu_id = ANY($1)
        )
      )
      ORDER BY section_id, parent_id, sort_order
    `;

    const menuResult = await dbRead.query(menuQuery, [ids]);
    const menuRows = menuResult?.rows || menuResult || [];

    // ✅ Update query
    const updateQuery = queryGenerator.generateUpdateQuery(
      {
        role_name: payload.role_name,
        entity_type: payload.role_type,
        permissions: JSON.stringify(createFullMenu(menuRows)),
        updated_date: moment().format(DB_TIME_FORMAT),
        updated_by: user.login_id,
      },
      { role_id: payload.role_id },
      TABLE_LIST.ROLE_MASTER,
    );

    await db.none(updateQuery);

    // ✅ Logging
    saveLog({
      module: "role",
      action: "edit",
      user_id: user.user_id,
      item_id: payload.role_id,
      payload: payload,
      previous: previousData,
    });

    return {
      success: true,
      msg: MESSAGES_LIST.ROLE_UPDATED,
    };
  } catch (error) {
    console.error("editRole Error:", error);
    return {
      success: false,
      msg: "Something went wrong",
    };
  }
}

export async function getMenu() {
  try {
    const query = `
      SELECT *
      FROM ${TABLE_LIST.MENU_MASTER}
      WHERE status = 1
      ORDER BY section_id, parent_id, sort_order
    `;

    const result = await dbRead.query(query);
    return {
      success: true,
      menu: createFullMenu(result),
    };
  } catch (error) {
    console.error("getMenu Error:", error);
    return {
      success: false,
      menu: [],
    };
  }
}
