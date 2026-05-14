"use server";

import axios from "axios";
import { ObjectId } from "mongodb";

import { getMainTenderCollection } from "@/utils/lib/mongodb";
import { backupAndDeleteFromS3, uploadToS3 } from "@/utils/s3Update";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { saveLog } from "@/utils/logger";

const normalizeStoredDocuments = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse tender documents:", error);
      return [];
    }
  }

  return [];
};

const normalizeStoredRequiredDocuments = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse required documents:", error);
      return [];
    }
  }

  return [];
};

const extractUploadedDocs = async (documents = []) => {
  const uploadedDocs = [];

  for (const file of documents) {
    if (!file || typeof file === "string") {
      continue;
    }

    const uploaded = await uploadToS3(file);

    uploadedDocs.push({
      type: "uploaded_document",
      title: file.name,
      original_url: null,
      s3_path: uploaded.url,
      uploaded_at: new Date(),
    });
  }

  return uploadedDocs;
};

const getDeletedDocuments = (
  existingDocuments = [],
  retainedDocuments = [],
) => {
  const retainedPaths = new Set(
    retainedDocuments.map((document) => document?.s3_path).filter(Boolean),
  );

  return existingDocuments.filter((document) => {
    const path = document?.s3_path;
    return path && !retainedPaths.has(path);
  });
};

const getTodayStart = () => {
  const today = new Date();
  return today;
};

export async function searchModification({
  tenderNumber = "",
  title = "",
  status = "",
} = {}) {
  try {
    const normalizedTenderNumber = String(tenderNumber || "").trim();
    const normalizedStatus = String(status || "").trim();
    const normalizedTitle = String(title || "").trim();

    if (!normalizedTenderNumber) {
      return {
        success: false,
        list: [],
        error: "Tender number is required",
      };
    }

    const collection = await getMainTenderCollection();
    const query = {
      $or: [
        { teb_number: normalizedTenderNumber },
        { tender_number: normalizedTenderNumber },
      ],
    };

    // if (normalizedStatus) {
    //   const todayStart = getTodayStart();
    //   const normalizedStatusKey = normalizedStatus.toLowerCase();

    //   if (normalizedStatusKey === "active") {
    //     query.tender_end_date = { $gt: todayStart };
    //   }

    //   if (normalizedStatusKey === "archive") {
    //     query.tender_end_date = { $lt: todayStart };
    //   }
    // }

    if (normalizedTitle) {
      query.$and = [
        {
          $or: [
            { tender_title: { $regex: normalizedTitle, $options: "i" } },
            {
              "llm_extracted_data.basic_info.generated_title": {
                $regex: normalizedTitle,
                $options: "i",
              },
            },
          ],
        },
      ];
    }

    const list = await collection
      .find(query)
      .sort({ updated_at: -1, created_at: -1, _id: -1 })
      .limit(20)
      .toArray();

    return {
      success: true,
      list: list.map((item) => ({
        ...item,
        _id: item?._id?.toString?.() || "",
      })),
    };
  } catch (error) {
    console.error("searchModification:", error);
    return {
      success: false,
      list: [],
      error: error.message,
    };
  }
}

export async function updateTenderModificationData(tenderData) {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  try {
    const payload = Object.fromEntries(tenderData.entries());
    const id = String(payload.id || "").trim();

    if (!id) {
      return {
        success: false,
        error: "Tender id is required",
      };
    }

    const collection = await getMainTenderCollection();
    const existingDoc = await collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { tender_documents_path: 1 } },
    );

    if (!existingDoc) {
      return {
        success: false,
        error: "Tender entry not found",
      };
    }

    const retainedDocuments = normalizeStoredDocuments(
      payload.retained_documents || existingDoc.tender_documents_path,
    );
    const deletedDocuments = getDeletedDocuments(
      normalizeStoredDocuments(existingDoc.tender_documents_path),
      retainedDocuments,
    );
    const uploadedDocs = await extractUploadedDocs(
      tenderData.getAll("document"),
    );
    const finalDocuments = [...retainedDocuments, ...uploadedDocs];

    const requiredDocuments = normalizeStoredRequiredDocuments(
      payload.required_documents,
    );
    const requiredDocumentNames = requiredDocuments
      .map((document) =>
        typeof document === "string" ? document : document?.name,
      )
      .filter(Boolean);
    const updatedData = {
      tender_title: payload.tender_title,
      tender_description: payload.tender_description,
      tender_number: payload.tender_number,
      source_tag: payload.source_tag,
      tender_bidding_type: payload.tender_bidding_type,
      tender_category: payload.tender_category,
      tender_financier: payload.tender_financier,
      tender_value: payload.tender_value,
      tender_start_date: payload.tender_start_date,
      tender_end_date: payload.tender_end_date,
      tender_publishing_date: payload.tender_publishing_date,
      tender_organisation: payload.tender_purchaser_name,
      tender_purchaser_name: payload.tender_purchaser_name,
      tender_purchaser_address: payload.tender_purchaser_address,
      tender_emd: payload.tender_emd,
      tender_pincode: payload.tender_pincode,
      tender_email_id: payload.tender_email_id,
      tender_website: payload.tender_website,
      tender_country: payload.tender_country,
      tender_state: payload.tender_state,
      tender_city: payload.tender_city,
      tender_type: payload.tender_type,
      tender_contract_type: payload.tender_contract_type,
      tender_contact_person: payload.tender_contact_person,
      tender_contract_period: payload.tender_contract_period,
      tender_ministry_name: payload.tender_ministry_name,
      main_category: payload.main_category,
      sub_category: payload.sub_category,
      tender_documents_path: finalDocuments,
      updated_at: new Date(),
      "llm_extracted_data.basic_info.main_category": payload.main_category,
      "llm_extracted_data.basic_info.sub_category": payload.sub_category,
      "llm_extracted_data.basic_info.generated_title": payload.tender_title,
      "llm_extracted_data.basic_info.summary": payload.tender_description,
      "llm_extracted_data.basic_info.tender_type": payload.tender_type,
      "llm_extracted_data.basic_info.evaluation_method":
        payload.tender_evaluation,
      "llm_extracted_data.organization.department": payload.department,
      "llm_extracted_data.organization.ministry": payload.tender_ministry_name,
      "llm_extracted_data.organization.office_name":
        payload.tender_contract_period,
      "llm_extracted_data.organization.organisation_name":
        payload.tender_purchaser_name,
      "llm_extracted_data.timeline.bid_end_datetime": payload.tender_end_date,
      "llm_extracted_data.timeline.bid_open_datetime":
        payload.tender_publishing_date,
      "llm_extracted_data.timeline.bid_start_datetime":
        payload.tender_start_date,
      "llm_extracted_data.timeline.bid_offer_validity_days":
        payload.tender_contract_period,
      "llm_extracted_data.timeline.contract_period":
        payload.tender_contract_period,
      "llm_extracted_data.timeline.delivery_days":
        payload.tender_contract_period,
      "llm_extracted_data.commercial.type_of_bid":
        payload.tender_procurement_process,
      "llm_extracted_data.commercial.evaluation_method":
        payload.tender_evaluation,
      "llm_extracted_data.eligibility.documents_required":
        requiredDocumentNames,
    };

    const estimatedBidValue = payload.tender_value;
    updatedData["llm_extracted_data.financial.estimated_bid_value"] =
      estimatedBidValue
        ? {
            amount: estimatedBidValue,
            currency: "INR",
          }
        : null;

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updatedData,
      },
    );

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        error: "Tender entry not found",
      };
    }

    if (deletedDocuments.length > 0) {
      await Promise.all(
        deletedDocuments.map(async (document) => {
          try {
            await backupAndDeleteFromS3(document?.s3_path);
          } catch (backupDeleteError) {
            console.error(
              "Failed to backup and delete tender document from S3:",
              document?.s3_path,
              backupDeleteError,
            );
          }
        }),
      );
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
        "OpenSearch indexing failed:",
        err?.response?.data || err.message,
      );
    }

    saveLog({
      module: "tender_modification",
      action: "edit",
      item_id: id,
      user_id,
      payload: payload,
    });

    return {
      success: true,
      message: "Tender modification updated successfully",
      data: {
        _id: id,
        ...updatedData,
      },
    };
  } catch (error) {
    console.error("Error in updateTenderModificationData:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
