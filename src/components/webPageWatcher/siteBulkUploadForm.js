"use client";

import { AppContext } from "@/contextProvider";
import { useContext, useMemo, useState } from "react";
import style from "@/css/coupon/coupon.module.scss";
import { SITEVISIT_FIELD, SITEVISIT_SAMPLE_ROW } from "@/utils/masterData";
import commonStyle from "@/css/common/common.module.scss";

export default function SiteBulkUploadForm() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useContext(AppContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        showAlert("Please upload a valid Excel or CSV file", 0);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showAlert("Please select a file to upload", 0);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/webPageWatcher/sitebulkProcess", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        showAlert(result.message || "Bulk data processed successfully", 1);
        setFile(null);
        // Reset file input
        document.getElementById("bulkFileInput").value = "";
      } else {
        showAlert(result.message || "Error processing bulk data", 0);
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Error processing file. Please try again.", 0);
    } finally {
      setIsLoading(false);
    }
  };

  const templateCsv = useMemo(() => {
    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const headerLine = SITEVISIT_FIELD.join(",");
    const sampleLine = SITEVISIT_FIELD.map((header) =>
      escapeCsvValue(SITEVISIT_SAMPLE_ROW[header] ?? ""),
    ).join(",");

    return `${headerLine}\n${sampleLine}\n`;
  }, []);

  const handleTemplateDownload = () => {
    const blob = new Blob([templateCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "siteLink.csv";
    link.click();
    URL.revokeObjectURL(url);
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
            <h5>Upload Site Visit New Links</h5>
            <button
              className={commonStyle.commonBtn}
              type="button"
              onClick={handleTemplateDownload}
            >
              Download Template
            </button>
          </div>

          <form onSubmit={handleSubmit} className="row">
            <div className={style.couponRow + " " + "col-md-6"}>
              <label htmlFor="bulkFileInput">Upload Excel/CSV File:</label>
              <input
                id="bulkFileInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                disabled={isLoading}
                required
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
            <div className={commonStyle.formBtnWrap}>
              <button
                type="submit"
                disabled={isLoading || !file}
                className={commonStyle.commonBtn}
              >
                {isLoading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
