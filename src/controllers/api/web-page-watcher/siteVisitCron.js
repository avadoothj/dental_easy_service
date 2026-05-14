// import "server-only";
// import axios from "axios";
// import crypto from "crypto";
// import pLimit from "p-limit";
// import { db } from "@/utils/lib/database";
// import { queryGenerator } from "@/utils/lib/queryGenerator";
// import { TABLE_LIST } from "@/utils/lib/tablesList";
// import { load } from "cheerio";

// const BATCH_SIZE = 100;
// const limit = pLimit(5);

// let isProcessingActive = false;

// // const extractTableText = (html = "") => {
// //   const $ = load(html);

// //   $("script, style, noscript, iframe").remove();
// //   $("header, footer, nav").remove();

// //   let text = "";

// //   $("body table").each((_, table) => {
// //     $(table).find("tr").each((_, row) => {
// //       let rowText = [];

// //       $(row).find("th, td").each((_, cell) => {
// //         let cellText = $(cell)
// //           .text()
// //           .replace(/\u00A0/g, " ") // remove &nbsp;
// //           .replace(/\s+/g, " ")
// //           .trim();

// //         // ❌ ignore dynamic text
// //         if (
// //           /last\s*updated/i.test(cellText) ||
// //           /visitor/i.test(cellText) ||
// //           /date/i.test(cellText)
// //         ) {
// //           return;
// //         }

// //         if (cellText) {
// //           rowText.push(cellText);
// //         }
// //       });

// //       if (rowText.length) {
// //         text += rowText.join("|") + "\n"; // stable structure
// //       }
// //     });
// //   });

// //   // fallback
// //   if (!text.trim()) {
// //     text = $("body").text();
// //   }

// //   return text.trim();
// // };

// export const extractTableText = (html = "") => {
//   const $ = load(html);

//   $("script, style, noscript, iframe").remove();
//   $("header, footer, nav").remove();

//   let textParts = [];

//   $("body table").each((_, table) => {
//     $(table)
//       .find("tr")
//       .each((_, row) => {
//         let rowData = [];

//         $(row)
//           .find("th, td")
//           .each((_, cell) => {
//             let cellText = $(cell)
//               .text()
//               .replace(/\u00A0/g, " ")
//               .replace(/\s+/g, " ")
//               .trim();

//             if (cellText) rowData.push(cellText);
//           });

//         if (rowData.length) {
//           textParts.push(rowData.join("|"));
//         }
//       });
//   });

//   const contentDiv = $("#cpBody_dvContent");

//   if (contentDiv.length) {
//     contentDiv.find(".tender-panel").each((_, panel) => {
//       // title
//       let title = $(panel)
//         .find(".panel-title")
//         .text()
//         .replace(/\s+/g, " ")
//         .trim();

//       title = title.replace(/\(Closing Date.*?\)/i, "").trim();

//       if (title) textParts.push(title);

//       $(panel)
//         .find(".panel-body p")
//         .each((_, p) => {
//           let line = $(p)
//             .text()
//             .replace(/\u00A0/g, " ")
//             .replace(/\s+/g, " ")
//             .trim();

//           if (/date|time|closing|meeting|submission/i.test(line)) {
//             return;
//           }

//           if (line) textParts.push(line);
//         });
//     });
//   }

//   return textParts
//     .map((t) => t.trim())
//     .filter(Boolean)
//     .sort()
//     .join("\n");
// };

// async function buildHashFromUrl(url) {
//   const { data: html } = await axios.get(url, {
//     headers: { "User-Agent": "Mozilla/5.0" },
//     timeout: 15000,
//   });

//   const cleanedText = extractTableText(typeof html === "string" ? html : "");
//   return crypto.createHash("sha256").update(cleanedText).digest("hex");
// }

// async function getLinkBatch(lastId = 0) {
//   const query = `
// 		SELECT *
// 		FROM ${TABLE_LIST.ADD_LINK}
// 		WHERE id > $1
// 			AND NOT (status = $2 AND is_action_taken = $3)
// 		ORDER BY id
// 		LIMIT $4
// 	`;

//   return db.query(query, [lastId, "changes_detected", false, BATCH_SIZE]);
// }

// async function updateLinkStatus(row, newHash) {
//   const oldHash = row.hash_new_key;

//   let status = "";
//   let updatedDate = row.last_updated_date;

//   if (!oldHash) {
//     status = "visit";
//   } else if (oldHash === newHash) {
//     status = "no_changes";
//   } else {
//     status = "changes_detected";
//     updatedDate = new Date();
//   }

//   await db.query(
//     queryGenerator.generateUpdateQuery(
//       {
//         hash_old_key: oldHash,
//         hash_new_key: newHash,
//         status,
//         last_visited_date: new Date(),
//         last_updated_date: updatedDate,
//         is_action_taken: false,
//       },
//       { id: row.id },
//       TABLE_LIST.ADD_LINK,
//     ),
//   );
// }

// async function markInvalidHost(rowId) {
//   await db.query(
//     queryGenerator.generateUpdateQuery(
//       {
//         status: "invalid_host",
//         last_visited_date: new Date(),
//         last_updated_date: new Date(),
//       },
//       { id: rowId },
//       TABLE_LIST.ADD_LINK,
//     ),
//   );
// }

// async function processBatch(rows) {
//   await Promise.all(
//     rows.map((row) =>
//       limit(async () => {
//         try {
//           const hashKey = await buildHashFromUrl(row.url_link);
//           await updateLinkStatus(row, hashKey);
//         } catch (error) {
//           await markInvalidHost(row.id);
//         }
//       }),
//     ),
//   );
// }

// async function triggerProcessingInBackground() {
//   let lastId = 0;

//   while (true) {
//     const rows = await getLinkBatch(lastId);
//     if (rows.length === 0) {
//       break;
//     }

//     await processBatch(rows);
//     lastId = rows[rows.length - 1].id;
//   }
// }

// export async function startSiteVisitCron() {
//   if (isProcessingActive) {
//     return {
//       ok: true,
//       started: false,
//       message: "Processing is already running",
//     };
//   }

//   isProcessingActive = true;

//   try {
//     await triggerProcessingInBackground();

//     return {
//       ok: true,
//       started: true,
//       message: "Processing completed successfully",
//     };
//   } finally {
//     isProcessingActive = false;
//   }
// }

// export async function runSiteVisitCron() {
//   try {
//     return await startSiteVisitCron(true);
//   } catch (error) {
//     return {
//       ok: false,
//       message: error.message || "Unable to process site visit cron",
//     };
//   }
// }
import "server-only";
import axios from "axios";
import crypto from "crypto";
import pLimit from "p-limit";
import { db } from "@/utils/lib/database";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { load } from "cheerio";

const BATCH_SIZE = 100;
const limit = pLimit(5);

let isProcessingActive = false;

// export const extractTableText = (html = "") => {
//   const $ = load(html);

//   $("script, style, noscript, iframe").remove();
//   $("header, footer, nav").remove();

//   let textParts = [];
//   let hasTable = false;

//   $("body table").each((_, table) => {
//     hasTable = true;

//     $(table)
//       .find("tr")
//       .each((_, row) => {
//         let rowData = [];

//         $(row)
//           .find("th, td")
//           .each((_, cell) => {
//             let cellText = $(cell)
//               .text()
//               .replace(/\u00A0/g, " ")
//               .replace(/\s+/g, " ")
//               .trim();

//             if (cellText) rowData.push(cellText);
//           });

//         if (rowData.length) {
//           textParts.push(rowData.join("|"));
//         }
//       });
//   });

//   const contentDiv = $("#cpBody_dvContent");

//   if (contentDiv.length) {
//     contentDiv.find(".tender-panel").each((_, panel) => {
//       let title = $(panel)
//         .find(".panel-title")
//         .text()
//         .replace(/\s+/g, " ")
//         .trim();

//       title = title.replace(/\(Closing Date.*?\)/i, "").trim();

//       if (title) textParts.push(title);

//       $(panel)
//         .find(".panel-body p")
//         .each((_, p) => {
//           let line = $(p)
//             .text()
//             .replace(/\u00A0/g, " ")
//             .replace(/\s+/g, " ")
//             .trim();

//           if (/date|time|closing|meeting|submission/i.test(line)) {
//             return;
//           }

//           if (line) textParts.push(line);
//         });
//     });
//   }

//   return {
//     cleanedText: textParts
//       .map((t) => t.trim())
//       .filter(Boolean)
//       .sort()
//       .join("\n"),
//     hasTable,
//   };
// };

export const extractTableText = (html = "") => {
  const $ = load(html);

  $("script, style, noscript, iframe").remove();
  $("header, footer, nav").remove();

  let hasTable = false;

  // 🔁 Recursive function to process table
  const parseTable = (table, level = 0) => {
    hasTable = true;

    let result = {
      level,
      rows: [],
      children: [],
    };

    // 👉 Only direct rows (avoid nested mixing)
    $(table)
      .children("tbody")
      .children("tr")
      .each((_, row) => {
        let rowData = [];

        $(row)
          .children("th, td")
          .each((_, cell) => {
            // 🔍 Check if this cell has nested table
            const nestedTables = $(cell).children("table");

            if (nestedTables.length) {
              nestedTables.each((_, nestedTable) => {
                result.children.push(parseTable(nestedTable, level + 1));
              });
            }

            // 🧹 Extract only direct text (exclude nested table text)
            let cellText = $(cell)
              .clone()
              .children("table")
              .remove()
              .end()
              .text()
              .replace(/\u00A0/g, " ")
              .replace(/\s+/g, " ")
              .trim();

            if (cellText) rowData.push(cellText);
          });

        if (rowData.length) {
          result.rows.push(rowData.join("|"));
        }
      });

    return result;
  };

  let tablesData = [];

  // 👉 Only top-level tables (no parent table)
  $("body table").each((_, table) => {
    if ($(table).parents("table").length === 0) {
      tablesData.push(parseTable(table, 0));
    }
  });

  return {
    tables: tablesData,
    hasTable,
  };
};

async function buildHashFromUrl(url) {
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 15000,
  });

  const { cleanedText, hasTable } = extractTableText(
    typeof html === "string" ? html : "",
  );

  const hash = crypto.createHash("sha256").update(cleanedText).digest("hex");

  return { hash, hasTable };
}

async function insertTableLog(row, hasTable) {
  const query = `
    INSERT INTO tbl_site_table_log (link_id, url, has_table, created_at)
    VALUES ($1, $2, $3, NOW())
  `;

  await db.query(query, [row.id, row.url_link, hasTable]);
}

async function getLinkBatch(lastId = 0) {
  const query = `
    SELECT *
    FROM ${TABLE_LIST.ADD_LINK}
    WHERE id > $1
      AND NOT (status = $2 AND is_action_taken = $3)
    ORDER BY id
    LIMIT $4
  `;

  return db.query(query, [lastId, "changes_detected", false, BATCH_SIZE]);
}

async function updateLinkStatus(row, newHash) {
  const oldHash = row.hash_new_key;

  let status = "";
  let updatedDate = row.last_updated_date;

  if (!oldHash) {
    status = "visit";
  } else if (oldHash === newHash) {
    status = "no_changes";
  } else {
    status = "changes_detected";
    updatedDate = new Date();
  }

  await db.query(
    queryGenerator.generateUpdateQuery(
      {
        hash_old_key: oldHash,
        hash_new_key: newHash,
        status,
        last_visited_date: new Date(),
        last_updated_date: updatedDate,
        is_action_taken: false,
      },
      { id: row.id },
      TABLE_LIST.ADD_LINK,
    ),
  );
}

async function markInvalidHost(rowId) {
  await db.query(
    queryGenerator.generateUpdateQuery(
      {
        status: "invalid_host",
        last_visited_date: new Date(),
        last_updated_date: new Date(),
      },
      { id: rowId },
      TABLE_LIST.ADD_LINK,
    ),
  );
}

async function processBatch(rows) {
  await Promise.all(
    rows.map((row) =>
      limit(async () => {
        try {
          const { hash, hasTable } = await buildHashFromUrl(row.url_link);

          // await insertTableLog(row, hasTable);

          await updateLinkStatus(row, hash);
        } catch (error) {
          await markInvalidHost(row.id);
        }
      }),
    ),
  );
}

async function triggerProcessingInBackground() {
  let lastId = 0;

  while (true) {
    const rows = await getLinkBatch(lastId);
    if (rows.length === 0) {
      break;
    }

    await processBatch(rows);
    lastId = rows[rows.length - 1].id;
  }
}

export async function startSiteVisitCron() {
  if (isProcessingActive) {
    return {
      ok: true,
      started: false,
      message: "Processing is already running",
    };
  }

  isProcessingActive = true;

  try {
    await triggerProcessingInBackground();

    return {
      ok: true,
      started: true,
      message: "Processing completed successfully",
    };
  } finally {
    isProcessingActive = false;
  }
}

export async function runSiteVisitCron() {
  try {
    return await startSiteVisitCron(true);
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Unable to process site visit cron",
    };
  }
}
