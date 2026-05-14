"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/utils/lib/database";
import { getMainTenderCollection } from "@/utils/lib/mongodb";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { saveLog } from "@/utils/logger";

export async function findTenderInDb(reqBody) {
  try {
    const searchKey = reqBody.tender_number;
    if (!searchKey) return { success: false, msg: "Tender Number required." };

    let tenderDetail = null;
    const collection = await getMainTenderCollection();

    if (collection) {
      const mongoData = await collection.findOne({ teb_number: searchKey });

      if (mongoData) {
        const activeResults = (
          mongoData.bid_awarded_result?.financial_evaluation || []
        ).filter((item) => item.is_deleted !== true);

        tenderDetail = {
          teb_number: mongoData.teb_number || "-",
          tender_number: mongoData.tender_number || "-",
          tender_title: mongoData.tender_title || "-",
          tender_country: mongoData.tender_country || "-",
          tender_state: mongoData.tender_state || "-",
          tender_city: mongoData.tender_city || "-",
          tender_organisation: mongoData.tender_organisation || "-",
          bid_awarded_result: activeResults,
          status: mongoData.status || "-",
        };
      }
    }

    if (!tenderDetail) return { success: false, msg: "No tender found." };

    return { success: true, data: JSON.parse(JSON.stringify(tenderDetail)) };
  } catch (error) {
    return { success: false, msg: "Error" };
  }
}

export const updateTenderAwardResults = async (reqBody) => {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;
  try {
    const { tender_number, seller_data_list } = reqBody;
    const collection = await getMainTenderCollection();

    const refResult = await db.query(
      `INSERT INTO tbl_contract_award_refance (tender_number)
       VALUES ($1)
       ON CONFLICT (tender_number)
       DO UPDATE SET tender_number = EXCLUDED.tender_number
       RETURNING id`,
      [tender_number],
    );

    const tender_ref_id = refResult[0].id;

    // const existingRes = await db.query(
    //   `SELECT * FROM tbl_contract_award WHERE tender_ref_id = $1`,
    //   [tender_ref_id],
    // );

    // const existingMap = {};
    // existingRes.forEach((row) => {
    //   existingMap[row.rank] = row;
    // });

    for (const item of seller_data_list) {
      const { row_id, rank, seller_name, total_price, email_id, is_deleted } =
        item;

      const final_row_id = row_id || randomUUID();
      const cleanPrice = parseFloat(
        String(total_price).replace(/[^0-9.]/g, ""),
      ).toFixed(2);

      // const previous = existingMap[rank] || null;

      if (is_deleted === true) {
        await db.query(
          `UPDATE tbl_contract_award
           SET is_deleted = TRUE
           WHERE tender_ref_id = $1 AND rank = $2`,
          [tender_ref_id, rank],
        );

        // saveLog({
        //   module: "contract_award",
        //   action: "delete",
        //   item_id: tender_number,
        //   user_id,
        //   payload: item,
        //   previous,
        // });

        if (collection) {
          await collection.updateOne(
            {
              tender_number,
              "bid_awarded_result.financial_evaluation.rank": rank,
            },
            {
              $set: {
                "bid_awarded_result.financial_evaluation.$.is_deleted": true,
              },
            },
          );
        }
      } else {
        await db.query(
          `INSERT INTO tbl_contract_award
           (tender_ref_id, row_id, seller_name, total_price, rank, email_id, is_deleted)
           VALUES ($1, $2, $3, $4, $5, $6, FALSE)
           ON CONFLICT (tender_ref_id, rank)
           DO UPDATE SET
             row_id = EXCLUDED.row_id,
             seller_name = EXCLUDED.seller_name,
             total_price = EXCLUDED.total_price,
             email_id = EXCLUDED.email_id,
             is_deleted = FALSE`,
          [
            tender_ref_id,
            final_row_id,
            seller_name,
            cleanPrice,
            rank,
            email_id || null,
          ],
        );

        // if (item?.is_updated || item?.is_new) {
        //   let actionType = "";

        //   if (item?.is_new) {
        //     actionType = "add";
        //   } else if (item?.is_updated) {
        //     actionType = "edit";
        //   }

        //   saveLog({
        //     module: "contract_award",
        //     action: actionType,
        //     item_id: tender_number,
        //     user_id,
        //     payload: item,
        //     previous: item?.is_new ? null : previous,
        //   });
        // }

        if (collection) {
          const normalizedRank = rank ? rank.toUpperCase() : "";

          const mongoUpdate = await collection.updateOne(
            {
              tender_number,
              "bid_awarded_result.financial_evaluation.rank": {
                $regex: new RegExp(`^${normalizedRank}$`, "i"),
              },
            },
            {
              $set: {
                "bid_awarded_result.financial_evaluation.$[elem].seller_name":
                  seller_name,
                "bid_awarded_result.financial_evaluation.$[elem].total_price":
                  cleanPrice,
                "bid_awarded_result.financial_evaluation.$[elem].email_id":
                  email_id || "",
                "bid_awarded_result.financial_evaluation.$[elem].is_deleted": false,
                "bid_awarded_result.financial_evaluation.$[elem].rank":
                  normalizedRank,
                "bid_awarded_result.financial_evaluation.$[elem].is_winner":
                  normalizedRank === "L1" ? "winner" : null,
                "bid_awarded_result.financial_evaluation.$[elem].row_id":
                  final_row_id,
              },
            },
            {
              arrayFilters: [
                {
                  "elem.rank": {
                    $regex: new RegExp(`^${normalizedRank}$`, "i"),
                  },
                },
              ],
            },
          );

          if (mongoUpdate.matchedCount === 0) {
            await collection.updateOne(
              { tender_number },
              {
                $push: {
                  "bid_awarded_result.financial_evaluation": {
                    row_id: final_row_id,
                    seller_name,
                    total_price: cleanPrice,
                    rank,
                    email_id: email_id || "",
                    is_deleted: false,
                  },
                },
              },
            );
          }
        }
      }
    }

    saveLog({
      module: "contract_award",
      action: "edit",
      item_id: tender_number,
      user_id,
      payload: reqBody.seller_data_list,
      // previous: existingMap,
    });

    return { success: true };
  } catch (error) {
    console.log("Sync error:", error);
    return { success: false, msg: "Error" };
  }
};
