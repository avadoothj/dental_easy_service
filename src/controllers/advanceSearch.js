"use server";
import { advanceSearchInsertTender } from "./tender";
import { dbRead } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";

const cleanAdvanceSearchPayload = (params = {}) => {
  const payload = {};

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      key === "document"
    ) {
      return;
    }

    if (
      typeof FileList !== "undefined" &&
      value instanceof FileList &&
      value.length === 0
    ) {
      return;
    }

    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    payload[key] = value;
  });

  return payload;
};

const normalizeAdvanceOpenSearchResponse = (responseData, pageNo, perPage) => {
  const normalizedList = Array.isArray(responseData?.results)
    ? responseData?.results
    : [];

  return {
    success: true,
    list: normalizedList.map((item, index) => ({
      _id:
        item?._id?.toString?.() ||
        item?.id?.toString?.() ||
        item?.tender_number ||
        `${pageNo}-${perPage}-${index}`,
      ...item,
    })),
    total: responseData ? responseData.results_found : 0,
  };
};

export async function advanceInsertTender(tenderData) {
  return await advanceSearchInsertTender(tenderData);
}

export async function getAdvanceSearchData(payload = {}) {
  return new Promise(async (resolve, reject) => {
    payload.per_page = payload.per_page ?? 10;
    payload.page_no = payload.page_no ?? 1;

    const perPage = payload.per_page;
    const offset = (payload.page_no - 1) * perPage;

    let selectQuery = `SELECT t.tender_number,t.tender_title as title,t.tender_country as country,t.tender_city as city,t.tender_bid_type as bidding_type,t.tender_organisation as organization,t.tender_financier as financier,t.tender_end_date as closing_date `;
    let mainQuery = `FROM ${TABLE_LIST.ADD_TENDER} t `;

    let conditions = [];

    if (payload.search) {
      const searchParamRef = payload.search.trim();
      conditions.push(`(
          COALESCE(t.teb_number, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_number, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_title, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_organisation, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_country, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_state, '') ILIKE '${searchParamRef}'
          OR COALESCE(t.tender_city, '') ILIKE '${searchParamRef}'
        )`);
    }

    const status = "filtered";
    conditions.push(`t.status = '${status}'`);

    let filterQuery = "";
    if (conditions.length > 0) {
      filterQuery = " WHERE " + conditions.join(" AND ");
    }

    let sortLimitQuery = `
        ORDER BY t.id DESC 
        LIMIT ${perPage} OFFSET ${offset}
      `;

    const finalQuery = selectQuery + mainQuery + filterQuery + sortLimitQuery;
    dbRead
      .query(finalQuery)
      .then(function (result) {
        const countQuery = "SELECT COUNT(1) as count ";

        const totalCount = countQuery + mainQuery;
        const filterCount = countQuery + mainQuery + filterQuery;
        if (payload.page_no == 1 && filterQuery !== "") {
          Promise.all([dbRead.query(filterCount)])
            .then(function (response) {
              resolve({
                success: true,
                list: result,
                total: response[0][0].count,
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

export async function advanceOpenSearchData(params = {}) {
  try {
    const pageNo = Number(params.page_no || params.pageNo || 1);
    const perPage = Number(params.per_page || params.perPage || 10);

    let payloadData = {
      tender_number: params.tender_number?.trim(),
      title: params.tender_title?.trim(),
      summary: params.tender_description?.trim(),
      country: params.tender_country?.trim(),
      state: params.tender_state?.trim(),
      city: params.tender_city?.trim(),
      bidding_type: params.tender_bidding_type?.trim(),
      purchaser_name: params.tender_organisation?.trim(),
      financier: params.tender_financier?.trim(),
      tender_end_date: params.tender_end_date?.trim(),
    };

    const payload = cleanAdvanceSearchPayload({
      ...payloadData,
      page_no: pageNo,
      per_page: perPage,
    });

    const response = await fetch(
      `${process.env.OPENSEARCH_ENDPOINT}/search/uat/keyword_search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      return {
        success: false,
        list: [],
        total: 0,
        filter: 0,
        msg: `Advance open search API failed with status ${response.status}`,
      };
    }

    const responseData = await response.json();
    return normalizeAdvanceOpenSearchResponse(responseData, pageNo, perPage);
  } catch (error) {
    console.error("advanceOpenSearchData:", error);
    return {
      success: false,
      list: [],
      total: 0,
      filter: 0,
      error: error.message,
      msg: "Failed to fetch advance open search data",
    };
  }
}
