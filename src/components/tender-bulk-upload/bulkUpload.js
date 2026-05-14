"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  getTenderBulkUploadHistory,
  tenderBulkUpload,
} from "@/controllers/tenderBulkUpload";
import { AppContext } from "@/contextProvider";
import style from "@/styles/coupon/coupon.module.scss";
import {
  TEMPLATE_FIELD,
  TEMPLATE_SAMPLE_ROW,
} from "@/utils/masterData";
import commonStyle from "@/css/common/common.module.scss";
import { formatDate, getFileUrl } from "@/utils/utils";
import Link from "next/link";

const TEMPLATE_HEADERS = TEMPLATE_FIELD;

const ALLOWED_EXTENSIONS = [".csv", ".xls", ".xlsx"];
const ALLOWED_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "",
];
const ALLOWED_ZIP_EXTENSIONS = [".zip"];
const ALLOWED_ZIP_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
  "",
];

const getStatusMeta = (status) => {
  if (status === 0) {
    return {
      label: "Processing",
      background: "#eff6ff",
      color: "#1d4ed8",
      border: "#93c5fd",
    };
  }

  if (status === 1) {
    return {
      label: "Success",
      background: "#ecfdf5",
      color: "#065f46",
      border: "#86efac",
    };
  }

  if (status === 3) {
    return {
      label: "Partial Success",
      background: "#fffbeb",
      color: "#92400e",
      border: "#fcd34d",
    };
  }

  return {
    label: "Failed",
    background: "#fff1f2",
    color: "#9f1239",
    border: "#fda4af",
  };
};

export default function BulkUpload() {
  const { showAlert } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const templateCsv = useMemo(() => {
    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const headerLine = TEMPLATE_HEADERS.join(",");
    const sampleLine = TEMPLATE_HEADERS.map((header) =>
      escapeCsvValue(TEMPLATE_SAMPLE_ROW[header] ?? ""),
    ).join(",");

    return `${headerLine}\n${sampleLine}\n`;
  }, []);

  const resetSelection = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetMediaSelection = () => {
    setMediaFile(null);
    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name?.toLowerCase() || "";
    const isAllowedExtension = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    );
    const isAllowedType = ALLOWED_TYPES.includes(selectedFile.type);

    if (!isAllowedExtension || !isAllowedType) {
      showAlert("Please upload a valid CSV or Excel file", 2);
      resetSelection();
      return;
    }
    setFile(selectedFile);
  };

  const handleTemplateDownload = () => {
    const blob = new Blob([templateCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "tender-bulk-upload-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadHistory = async ({ silent = false } = {}) => {
    if (!silent) {
      setIsHistoryLoading(true);
    }

    try {
      const result = await getTenderBulkUploadHistory();

      if (result?.success) {
        setHistory(Array.isArray(result?.data) ? result.data : []);
        return;
      }

      setHistory([]);
    } catch (error) {
      console.error("Unable to load bulk upload history:", error);
      setHistory([]);
    } finally {
      if (!silent) {
        setIsHistoryLoading(false);
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      showAlert("Please select a file to upload", 2);
      return;
    }

    if (!mediaFile) {
      showAlert("Please select a ZIP file to upload", 2);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaFile", mediaFile);

      const result = await tenderBulkUpload(formData);
      await loadHistory();
      showAlert(result?.message ,1);

      if (result?.status) {
        resetSelection();
        resetMediaSelection();
      }
    } catch (error) {
      console.error("Tender bulk upload failed:", error);
      showAlert("Unable to process the bulk upload file", 2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setMediaFile(null);
      return;
    }

    const fileName = selectedFile.name?.toLowerCase() || "";
    const isAllowedExtension = ALLOWED_ZIP_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    );
    const isAllowedType = ALLOWED_ZIP_TYPES.includes(selectedFile.type);

    if (!isAllowedExtension || !isAllowedType) {
      showAlert("Please upload a valid ZIP file", 2);
      resetMediaSelection();
      return;
    }

    setMediaFile(selectedFile);
  };

  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <h5>
              Upload CSV or Excel file
            </h5>
            <button
              type="button"
              onClick={handleTemplateDownload}
              className={commonStyle.commonBtn}
            >
              Download Template
            </button>
          </div>

          <form onSubmit={handleSubmit} className="row">
            <div className={style.couponRow + " " + "col-md-6"}>
              <label htmlFor="tenderBulkUploadFile">
                Select Excel/CSV file
              </label>
              <input
                id="tenderBulkUploadFile"
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                disabled={isLoading}
                className={commonStyle.formControl}
              />
              {file ? (
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#047857",
                    fontSize: "14px",
                  }}
                >
                  Selected file: {file.name}
                </p>
              ) : null}
            </div>

            <div className={style.couponRow + " " + "col-md-6"}>
              <label htmlFor="tenderBulkUploadMediaFile">
                Upload Media Data
              </label>
              <input
                id="tenderBulkUploadMediaFile"
                ref={mediaInputRef}
                type="file"
                accept=".zip,application/zip,application/x-zip-compressed"
                onChange={handleMediaChange}
                disabled={isLoading}
                className={commonStyle.formControl}
              />
              {mediaFile ? (
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#047857",
                    fontSize: "14px",
                  }}
                >
                  Selected file: {mediaFile.name}
                </p>
              ) : null}
            </div>
            <div className={commonStyle.formBtnWrap}>
              <button
                type="submit"
                className={commonStyle.commonBtn}
                disabled={isLoading || !file || !mediaFile}
              >
                {isLoading ? "Submitting..." : "Upload File"}
              </button>
            </div>
          </form>
          <div
            style={{
              marginTop: "24px",
              marginBottom: "24px",
              display: "grid",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h5>Previous Upload History</h5>
              <button
                type="button"
                onClick={loadHistory}
                className={commonStyle.commonBtn}
                disabled={isHistoryLoading}
              >
                {isHistoryLoading ? "Loading..." : "Refresh History"}
              </button>
            </div>

            {isHistoryLoading ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                }}
              >
                Loading previous uploads...
              </div>
            ) : null}

            {!isHistoryLoading && history.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                }}
              >
                No previous bulk upload history found for this user.
              </div>
            ) : null}

            {!isHistoryLoading && history.length > 0
              ? history.map((item) => {
                  const statusMeta = getStatusMeta(item.status);
                  return (
                    <div className="card shadow rounded" key={item.id}>
                      <div className="card-body">
                        <h5 className="card-title mb-3 d-flex gap-2 align-items-center">
                          {item.processedBy || "-"}
                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: statusMeta.background,
                              color: statusMeta.color,
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {item.statusLabel || statusMeta.label}
                          </span>
                        </h5>

                        {item.status === 0 ? (
                          <div
                            style={{
                              marginBottom: "16px",
                              padding: "12px",
                              borderRadius: "10px",
                              border: `1px solid ${statusMeta.border}`,
                              background: statusMeta.background,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "12px",
                                flexWrap: "wrap",
                                marginBottom: "8px",
                                color: "#1e293b",
                                fontSize: "14px",
                                fontWeight: 500,
                              }}
                            >
                              <span>
                                Processed {item.currentProcessedCount || 0} of{" "}
                                {item.totalRecords || 0}
                              </span>
                              <span>{item.progressPercentage || 0}%</span>
                            </div>
                            <div
                              style={{
                                height: "10px",
                                borderRadius: "999px",
                                background: "#dbeafe",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${item.progressPercentage || 0}%`,
                                  height: "100%",
                                  background: "#2563eb",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                            <p
                              style={{
                                margin: "8px 0 0",
                                color: "#334155",
                                fontSize: "13px",
                              }}
                            >
                              Last processed row: {item.lastProcessedRow || 0}
                            </p>
                          </div>
                        ) : null}

                        <hr />

                        <div className="row">
                          <div className="col-md-4 mb-2">
                            <strong>Total Records:</strong> {item.totalRecords}
                          </div>
                          <div className="col-md-4 mb-2">
                            <strong>Success Records:</strong>
                            <span className="text-success">
                              {item.successRecords}
                            </span>
                          </div>
                          <div className="col-md-4 mb-2">
                            <strong>Failed Records:</strong>
                            <span className="text-danger">
                              {item.failedRecords}
                            </span>
                          </div>
                          {/* <div className="col-md-4 mb-2">
                            <strong>Matched Documents:</strong>
                            {item.matchedDocumentCount}
                          </div>
                          <div className="col-md-4 mb-2">
                            <strong>Missing Matches:</strong>{" "}
                            {item.missingDocumentCount}
                          </div> */}
                        </div>

                        <hr />

                        <h6 className="mb-2">File Details</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Excel File:</strong>{" "}
                            <Link href={getFileUrl(item.excelServerPath)}>
                              {item.fileName}
                            </Link>
                          </div>

                          <div className="col-md-3">
                            <strong>ZIP File:</strong>
                            <Link href={getFileUrl(item.zipServerPath)}>
                              view
                            </Link>
                          </div>
                          {item.failedRowsExcelPath && (
                            <div className="col-md-3">
                              <strong>Failed Rows Excel:</strong>
                              <Link href={getFileUrl(item.failedRowsExcelPath)}>
                                view
                              </Link>
                            </div>
                          )}
                        </div>
                        <hr />

                        <h6 className="mb-2">Time</h6>
                        <div className="row">
                          <div className="col-md-4">
                            <strong>Uploaded On:</strong>{" "}
                            {formatDate(item?.insertedDate,6) || "-"}
                          </div>
                          <div className="col-md-4">
                            <strong>Processed On:</strong>{" "}
                            {formatDate(item?.lastProcessedOn,6) || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
