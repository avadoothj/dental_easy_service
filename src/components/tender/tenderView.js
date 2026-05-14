import React from "react";
import Link from "next/link";
import commonStyle from "@/css/common/common.module.scss";

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getS3Url = (path) => {
  if (!path) {
    return "#";
  }

  const bucketUrl = "https://tender-bharo-tender-documents.s3.amazonaws.com/";

  if (path.startsWith("s3://tender-bharo-tender-documents/")) {
    return path.replace("s3://tender-bharo-tender-documents/", bucketUrl);
  }

  if (path.startsWith("tender_documents")) {
    return `${bucketUrl}${path}`;
  }

  return path;
};

export default function TenderView({ data }) {
  const detailRows = [
    { label: "Tender Title", value: data?.tender_title, fullWidth: true },
    {
      label: "Tender Description",
      value: data?.tender_description,
      fullWidth: true,
    },
    { label: "TEB Number", value: data?.teb_number },
    { label: "Tender Reference Number", value: data?.tender_number },
    { label: "Tender Organisation", value: data?.tender_organisation },
    { label: "Bidding Type", value: data?.tender_bidding_type },
    { label: "Tender Type", value: data?.tender_type },
    { label: "Main Category", value: data?.main_category },
    { label: "Sub Category", value: data?.sub_category },
    { label: "Tender Category", value: data?.tender_category },
    { label: "Contract Type", value: data?.tender_contract_type },
    { label: "Tender Value", value: data?.tender_value },
    { label: "Estimated Bid Value", value: data?.estimated_bid_value },
    { label: "Tender EMD", value: data?.tender_emd },
    { label: "Tender Evaluation", value: data?.tender_evaluation },
    { label: "Procurement Process", value: data?.tender_procurement_process },
    {
      label: "Tender Start Date",
      value: formatDateTime(data?.tender_start_date),
    },
    {
      label: "Tender Publishing Date",
      value: formatDateTime(data?.tender_publishing_date),
    },
    { label: "Tender End Date", value: formatDateTime(data?.tender_end_date) },
    { label: "Purchaser Name", value: data?.tender_purchaser_name },
    { label: "Purchaser Address", value: data?.tender_purchaser_address },
    { label: "Country", value: data?.tender_country },
    { label: "State", value: data?.tender_state },
    { label: "City", value: data?.tender_city },
    { label: "Financier", value: data?.tender_financier },
    { label: "Tender Email", value: data?.tender_email_id },
    { label: "Tender Website", value: data?.tender_website },
    { label: "Contact Person", value: data?.tender_contact_person },
    { label: "Office Name", value: data?.tender_office_name },
    { label: "Contract Period", value: data?.tender_contract_period },
    { label: "Status", value: data?.status },
    { label: "User Email", value: data?.user_email },
    { label: "Active", value: data?.is_active },
    { label: "Created At", value: formatDateTime(data?.created_at) },
    { label: "Updated At", value: formatDateTime(data?.updated_at) },
    { label: "Rejection Reason", value: data?.rejection_reason },
  ];

  return (
    <div className={commonStyle.mainContent}>
      <ul className={commonStyle.attributeWrapper}>
        {detailRows.map((item) => (
          <li
            key={item.label}
            className={item.fullWidth ? commonStyle.fullWidth : ""}
          >
            <span className={commonStyle.attribute}>{item.label}</span>
            <div className={commonStyle.value}>
              {getDisplayValue(item.value)}
            </div>
          </li>
        ))}
      </ul>

      <hr />

      <div className={commonStyle.requiredDocuments + " " + "mb-3"}>
        <h5>Required Documents</h5>
        {Array.isArray(data?.required_documents) &&
        data.required_documents.length > 0 ? (
          <ul className={commonStyle.ticks}>
            {data.required_documents.map((item) => (
              <li key={item?.id || item?.name}>
                <span className={commonStyle.copy}>{item?.name || "—"}</span>
              </li>
            ))}
          </ul>
        ) : (
          "—"
        )}
      </div>

      <hr />

      <div className={commonStyle.documentsWrapper}>
        <h5>Tender Documents</h5>
        {Array.isArray(data?.tender_documents_path) &&
        data.tender_documents_path.length > 0 ? (
          <ul>
            {data.tender_documents_path.map((item, index) => (
              <li key={`${item?.s3_path || item?.title || "doc"}—${index}`}>
                <a
                  href={getS3Url(item?.s3_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item?.title || `Document ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          "—"
        )}
      </div>

      <div className={commonStyle.formBtnWrap}>
        <Link href="/tenders" className={commonStyle.commonBtn + " " + commonStyle.stroke}>
          Back
        </Link>
      </div>
    </div>
  );
}
