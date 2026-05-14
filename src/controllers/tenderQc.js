"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  getMainTenderCollection,
  getAllCategoriesCollection,
} from "@/utils/lib/mongodb";
import { saveLog } from "@/utils/logger";
import axios from "axios";
import { getServerSession } from "next-auth";
const { ObjectId } = require("mongodb");

// export async function getTenderQcData(params = {}) {
//   try {
//     const search = params.search?.trim();
//     const pageNo = Number(params.page_no || params.pageNo || 1);
//     const perPage = Number(params.per_page || params.perPage || 10);
//     const skip = (pageNo - 1) * perPage;
//     const baseQuery = {
//       $or: [
//         { tender_city: { $in: [null, "", undefined] } },
//         { tender_state: { $in: [null, "", undefined] } },
//         { tender_country: { $in: [null, "", undefined] } },
//         { tender_title: { $in: [null, "", undefined] } },
//         { tender_end_date: { $in: [null, "", undefined] } },
//         {
//           "llm_extracted_data.basic_info.main_category": {
//             $in: [null, "", undefined],
//           },
//         },
//         {
//           "llm_extracted_data.basic_info.sub_category": {
//             $in: [null, "", undefined],
//           },
//         },
//         {
//           "llm_extracted_data.basic_info.generated_title": {
//             $in: [null, "", undefined],
//           },
//         }
//       ],
//     };

//     let query = baseQuery;
//     if (search) {
//       query = {
//         $and: [
//           baseQuery,
//           {
//             $or: [
//               { teb_number: { $regex: search, $options: "i" } },
//               { tender_title: { $regex: search, $options: "i" } },
//               { tender_city: { $regex: search, $options: "i" } },
//               { tender_state: { $regex: search, $options: "i" } },
//               { tender_country: { $regex: search, $options: "i" } },
//             ],
//           },
//         ],
//       };
//     }

//     const collection = await getMainTenderCollection();

//     const total = await collection.countDocuments(query);

//     const mongoList = await collection
//       .find(query)
//       .project({
//         _id: 1,
//         teb_number: 1,
//         tender_title: 1,
//         tender_city: 1,
//         tender_state: 1,
//         tender_country: 1,
//         tender_end_date: 1,
//         "llm_extracted_data.basic_info.main_category": 1,
//         "llm_extracted_data.basic_info.sub_category": 1,
//         "llm_extracted_data.basic_info.generated_title": 1,
//       })
//       .sort({ _id: -1 })
//       .skip(skip)
//       .limit(perPage)
//       .toArray();

//     const list = mongoList.map((doc) => ({
//       ...doc,
//       _id: doc._id.toString(),
//     }));

//     const response = {
//       success: true,
//       list,
//       total,
//       filter: total,
//     };
//     return response;
//   } catch (error) {
//     console.error("❌ Error in getTenderQcData:", error);
//     console.error("❌ Error stack:", error.stack);
//     return {
//       success: false,
//       list: [],
//       total: 0,
//       filter: 0,
//       error: error.message,
//     };
//   }
// }

export async function getTenderQcData(params = {}) {
  try {
    const search = params.search?.trim();
    const pageNo = Number(params.page_no || params.pageNo || 1);
    const perPage = Number(params.per_page || params.perPage || 10);
    const skip = (pageNo - 1) * perPage;

    const sortBy = params.sort_by || "_id";
    const sortOrder = params.sort_order === "asc" ? 1 : -1;

    const dynamicFilters = {};

    const formatFilter = (val, toUpper = false) => {
      if (!val) return null;
      const arr = val
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      return toUpper ? arr.map((v) => v.toUpperCase()) : arr;
    };

    if (params.country) {
      dynamicFilters.tender_country = {
        $in: formatFilter(params.country, true),
      };
    }
    if (params.state) {
      dynamicFilters.tender_state = { $in: formatFilter(params.state, true) };
    }
    if (params.city) {
      dynamicFilters.tender_city = { $in: formatFilter(params.city, true) };
    }
    if (params.main_category) {
      dynamicFilters["llm_extracted_data.basic_info.main_category"] = {
        $in: formatFilter(params.main_category),
      };
    }
    if (params.sub_category) {
      dynamicFilters["llm_extracted_data.basic_info.sub_category"] = {
        $in: formatFilter(params.sub_category),
      };
    }

    if (params.tender_start_date) {
      const start = new Date(params.tender_start_date);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      dynamicFilters.tender_start_date = { $gte: start, $lte: end };
    }

    if (params.tender_end_date) {
      const start = new Date(params.tender_end_date);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      dynamicFilters.tender_end_date = { $gte: start, $lte: end };
    }

    if (params.tender_publishing_date) {
      const start = new Date(params.tender_publishing_date);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      dynamicFilters.tender_publishing_date = { $gte: start, $lte: end };
    }
    const today = new Date();
    const baseQuery = {
      opensearch_index_generated: true,
      is_active: true,
      bid_awarded: { $ne: true },
      tender_end_date: { $gte: today },
      ...dynamicFilters,
      $or: [
        { tender_city: { $in: [null, "", undefined] } },
        { tender_state: { $in: [null, "", undefined] } },
        { tender_country: { $in: [null, "", undefined] } },
        // { tender_organisation: { $in: [null, "", undefined] } },
        // { tender_end_date: { $in: [null, "", undefined] } },
        {
          "llm_extracted_data.basic_info.main_category": {
            $in: [null, "", undefined],
          },
        },
        // {
        //   "llm_extracted_data.basic_info.sub_category": {
        //     $in: [null, "", undefined],
        //   },
        // },
        {
          "llm_extracted_data.basic_info.generated_title": {
            $in: [null, "", undefined],
          },
        },
        // {
        //   "llm_extracted_data.basic_info.summary": {
        //     $in: [null, "", undefined],
        //   },
        // },
      ],
    };

    let query = baseQuery;

    if (search) {
      query = {
        $and: [
          baseQuery,
          {
            $or: [
              { teb_number: { $regex: search, $options: "i" } },
              { tender_title: { $regex: search, $options: "i" } },
              { tender_city: { $regex: search, $options: "i" } },
              { tender_state: { $regex: search, $options: "i" } },
              { tender_country: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    const collection = await getMainTenderCollection();
    const total = await collection.countDocuments(query);

    const mongoList = await collection
      .aggregate([
        { $match: query },
        {
          $addFields: {
            sortField: `$${sortBy}`,
            isNull: {
              $cond: [
                {
                  $or: [
                    { $eq: [`$${sortBy}`, null] },
                    { $eq: [`$${sortBy}`, ""] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        {
          $sort: {
            isNull: 1,
            sortField: sortOrder,
          },
        },
        {
          $project: {
            _id: 1,
            teb_number: 1,
            tender_title: 1,
            tender_city: 1,
            tender_state: 1,
            tender_country: 1,
            tender_start_date: 1,
            tender_end_date: 1,
            tender_publishing_date: 1,
            source_id: 1,
            "llm_extracted_data.basic_info.main_category": 1,
            "llm_extracted_data.basic_info.sub_category": 1,
            "llm_extracted_data.basic_info.generated_title": 1,
          },
        },
        { $skip: skip },
        { $limit: perPage },
      ])
      .toArray();

    const list = mongoList.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return {
      success: true,
      list,
      total,
    };
  } catch (error) {
    console.error("Error in getTenderQcData:", error);
    return {
      success: false,
      list: [],
      total: 0,
      error: error.message,
    };
  }
}

export async function getTenderQcDetails(id) {
  try {
    const collection = await getMainTenderCollection();

    const detail = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!detail) {
      return {
        success: false,
        error: "Tender QC entry not found",
      };
    }

    return {
      success: true,
      data: {
        ...detail,
        _id: detail._id.toString(),
      },
    };
  } catch (error) {
    console.error("❌ Error in getTenderQcDetails:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateTenderQcData(id, updatedData) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const collection = await getMainTenderCollection();
    if (
      Object.prototype.hasOwnProperty.call(
        updatedData,
        "llm_extracted_data.financial.estimated_bid_value.amount",
      )
    ) {
      const estimatedBidValue =
        updatedData["llm_extracted_data.financial.estimated_bid_value.amount"];

      updatedData["llm_extracted_data.financial.estimated_bid_value"] =
        estimatedBidValue
          ? {
              amount: estimatedBidValue,
              currency: "INR",
            }
          : null;

      delete updatedData[
        "llm_extracted_data.financial.estimated_bid_value.amount"
      ];
    }
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updatedData,
          is_tender_qc: true,
          updated_at: new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        error: "Tender QC entry not found",
      };
    }

    try {
      await axios.post(
        process.env.OPENSEARCH_ENDPOINT + "/tender/update",
        {
          object_id: String(id),
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

    saveLog({
      module: "tender_qc",
      action: "edit",
      item_id: id,
      user_id,
      payload: updatedData,
    });

    return {
      success: true,
      message: "Tender QC data updated successfully",
      data: {
        _id: id,
        ...updatedData,
      },
    };
  } catch (error) {
    console.error("❌ Error in updateTenderQcData:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getCategoriesWithSubcategories() {
  const collection = await getAllCategoriesCollection();

  const data = await collection
    .aggregate([
      {
        $group: {
          _id: "$categories",
          subcategories: { $push: "$subcategories" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          subcategories: 1,
        },
      },
      {
        $sort: { category: 1 }, // ✅ category ascending
      },
    ])
    .toArray();

  const formatText = (text) =>
    text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formattedData = data.map((item) => ({
    category: formatText(item.category),
    subcategories: item.subcategories
      .map((sub) => formatText(sub))
      .sort((a, b) => a.localeCompare(b)), // ✅ subcategories ascending
  }));

  return formattedData;
}

export async function getTenderCountBySelectedDate(params = {}) {
  try {
    const { date } = params;

    if (!date) {
      return { success: false, count: 0 };
    }

    const collection = await getMainTenderCollection();

    const result = await collection
      .aggregate([
        {
          $match: {
            is_tender_qc: true,
            tender_end_date: { $ne: null },
          },
        },
        {
          $addFields: {
            formattedDate: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$tender_end_date" },
                timezone: "Asia/Kolkata", // 🔥 important
              },
            },
          },
        },
        {
          $match: {
            formattedDate: date,
          },
        },
        {
          $count: "count",
        },
      ])
      .toArray();

    return {
      success: true,
      count: result[0]?.count || 0,
      date,
    };
  } catch (error) {
    console.error(error);
    return { success: false, count: 0 };
  }
}

export async function disableTenderController({ id, disableReason }) {
  try {
    const collection = await getMainTenderCollection();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          is_active: false,
          disable_comment: disableReason,
          updated_at: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Tender not found" };
    }

    return {
      success: true,
      message: "Tender disabled successfully",
    };
  } catch (error) {
    console.error("Disable Tender Error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
