"use client";

import { AppContext } from "@/contextProvider";
import { getConstant } from "@/utils/utils";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/css/coupon/coupon.module.scss";
import { useRouter } from "next/navigation";
import commonStyle from "@/css/common/common.module.scss";


export default function CreateForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { showAlert } = useContext(AppContext);
  const router = useRouter();
  const inputMaxLength = getConstant("INPUT_MAXLENGTH");

  const defaultFormData = {
    project_name: "",
    project_country: "",
    project_details: "",
    purchaser_name: "",
    purchaser_country: "",
    purchaser_address: "",
    purchaser_email: "",
    purchaser_url: "",
    project_status: "",
    contactor_name: "",
    project_completion_date: "",
    project_value: "",
    project_currency: "",
    financier: "",
    sector: "",
    source_website: "",
    document: null, // file object
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);

  const updateSelectedForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });
      const response = await fetch("/api/tender/add", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();
      if (result.status || result.success) {
        showAlert(result.message || "Tender saved successfully", 1);
        setFormData(defaultFormData);
        router.push("/tender-list");
      } else {
        showAlert(result.message || "Something went wrong");
      }
    } catch (error) {
      showAlert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const validation = {
    project_name: register("project_name", { required: "Project name is required" }),
    project_country: register("project_country", { required: "Country is required" }),
    project_details: register("project_details", { required: "Details are required" }),
    purchaser_name: register("purchaser_name", { required: "Purchaser name is required" }),
    purchaser_country: register("purchaser_country", { required: "Purchaser country is required" }),
    purchaser_address: register("purchaser_address", { required: "Purchaser address is required" }),
    financier: register("financier", { required: "Financier is required" }),
    sector: register("sector", { required: "Sector is required" }),
    source_website: register("source_website", { required: "Source website is required" }),
  };

  return (
    <>
      <div className={style.assignCoupon}>
        <div className={style.inner}>
          <div className={style.assignCouponForm}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="row">
              {/* Project name */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Project Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                    {...validation.project_name}
                    type="text"
                    placeholder="Enter project name"
                    maxLength={inputMaxLength}
                    value={formData.project_name}
                    className={commonStyle.formControl}
                    onChange={(e) => {
                      validation.project_name.onChange(e);
                      updateSelectedForm("project_name", e.target.value);
                    }}
                  />
                  {errors.project_name && (
                    <span className={style.error1}>{errors.project_name?.message}</span>
                  )}
                </div>
              </div>

              {/* Project country */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Project Country <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                    {...validation.project_country}
                    type="text"
                    placeholder="Enter country"
                    className={commonStyle.formControl}
                    maxLength={inputMaxLength}
                    value={formData.project_country}
                    onChange={(e) => {
                      validation.project_country.onChange(e);
                      updateSelectedForm("project_country", e.target.value);
                    }}
                  />
                  {errors.project_country && (
                    <span className={style.error1}>{errors.project_country?.message}</span>
                  )}
                </div>
              </div>

              {/* Project details */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Project Details <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <textarea
                    {...validation.project_details}
                    placeholder="Enter project details"
                    className={commonStyle.formControl}
                    maxLength={5000}
                    value={formData.project_details}
                    onChange={(e) => {
                      validation.project_details.onChange(e);
                      updateSelectedForm("project_details", e.target.value);
                    }}
                    style={{ width: "100%", minHeight: "80px" }}
                  />
                  {errors.project_details && (
                    <span className={style.error1}>{errors.project_details?.message}</span>
                  )}
                </div>
              </div>

              {/* Purchaser name */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Purchaser Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                    {...validation.purchaser_name}
                    type="text"
                    className={commonStyle.formControl}
                    placeholder="Enter purchaser name"
                    maxLength={inputMaxLength}
                    value={formData.purchaser_name}
                    onChange={(e) => {
                      validation.purchaser_name.onChange(e);
                      updateSelectedForm("purchaser_name", e.target.value);
                    }}
                  />
                  {errors.purchaser_name && (
                    <span className={style.error1}>{errors.purchaser_name?.message}</span>
                  )}
                </div>
              </div>

              {/* Purchaser country */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Purchaser Country <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                    {...validation.purchaser_country}
                    type="text"
                    className={commonStyle.formControl}
                    placeholder="Enter purchaser country"
                    maxLength={inputMaxLength}
                    value={formData.purchaser_country}
                    onChange={(e) => {
                      validation.purchaser_country.onChange(e);
                      updateSelectedForm("purchaser_country", e.target.value);
                    }}
                  />
                  {errors.purchaser_country && (
                    <span className={style.error1}>{errors.purchaser_country?.message}</span>
                  )}
                </div>
              </div>

              {/* Purchaser address */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Purchaser Address <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <textarea
                    {...validation.purchaser_address}
                    placeholder="Enter purchaser address"
                    maxLength={inputMaxLength}
                    className={commonStyle.formControl}
                    value={formData.purchaser_address}
                    onChange={(e) => {
                      validation.purchaser_address.onChange(e);
                      updateSelectedForm("purchaser_address", e.target.value);
                    }}
                    style={{ width: "100%", minHeight: "60px" }}
                  />
                  {errors.purchaser_address && (
                    <span className={style.error1}>{errors.purchaser_address?.message}</span>
                  )}
                </div>
              </div>

              {/* Additional optional fields (email, url, etc.) */}
              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Purchaser Email</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="email"
                    placeholder="Enter email"
                    maxLength={inputMaxLength}
                    value={formData.purchaser_email}
                    onChange={(e) => updateSelectedForm("purchaser_email", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Purchaser URL</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="text"
                    placeholder="Enter website url"
                    maxLength={inputMaxLength}
                    value={formData.purchaser_url}
                    onChange={(e) => updateSelectedForm("purchaser_url", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Project Status</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="text"
                    placeholder="Enter status"
                    maxLength={inputMaxLength}
                    value={formData.project_status}
                    onChange={(e) => updateSelectedForm("project_status", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Contactor Name</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="text"
                    placeholder="Enter contactor name"
                    maxLength={inputMaxLength}
                    value={formData.contactor_name}
                    onChange={(e) => updateSelectedForm("contactor_name", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Completion Date</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="datetime-local"
                    value={formData.project_completion_date}
                    onChange={(e) => updateSelectedForm("project_completion_date", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Project Value</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="text"
                    placeholder="Enter value"
                    maxLength={inputMaxLength}
                    value={formData.project_value}
                    onChange={(e) => updateSelectedForm("project_value", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Project Currency</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="text"
                    placeholder="Enter currency"
                    maxLength={inputMaxLength}
                    value={formData.project_currency}
                    onChange={(e) => updateSelectedForm("project_currency", e.target.value)}
                  />
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Financier <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    {...validation.financier}
                    type="text"
                    placeholder="Enter financier"
                    maxLength={inputMaxLength}
                    value={formData.financier}
                    onChange={(e) => {
                      validation.financier.onChange(e);
                      updateSelectedForm("financier", e.target.value);
                    }}
                  />
                  {errors.financier && (
                    <span className={style.error1}>{errors.financier?.message}</span>
                  )}
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Sector <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    {...validation.sector}
                    type="text"
                    placeholder="Enter sector"
                    maxLength={inputMaxLength}
                    value={formData.sector}
                    onChange={(e) => {
                      validation.sector.onChange(e);
                      updateSelectedForm("sector", e.target.value);
                    }}
                  />
                  {errors.sector && (
                    <span className={style.error1}>{errors.sector?.message}</span>
                  )}
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>
                  Source Website <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    {...validation.source_website}
                    type="text"
                    placeholder="Enter source website"
                    maxLength={inputMaxLength}
                    value={formData.source_website}
                    onChange={(e) => {
                      validation.source_website.onChange(e);
                      updateSelectedForm("source_website", e.target.value);
                    }}
                  />
                  {errors.source_website && (
                    <span className={style.error1}>{errors.source_website?.message}</span>
                  )}
                </div>
              </div>

              <div className={style.couponRow + " " + "col-md-4"}>
                <label>Document(Optional)</label>
                <div className={style.inputsWrap}>
                  <input
                  className={commonStyle.formControl}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    onChange={(e) => updateSelectedForm("document", e.target.files[0] || null)}
                  />
                  {formData.document && (
                    <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
                      Selected: {formData.document.name}
                    </div>
                  )}
                </div>
              </div>

            </form>
              <div className={commonStyle.formBtnWrap}>
                <button
                  type="submit"
                  className={commonStyle.commonBtn}
                  disabled={isLoading}
                >
                  {isLoading ? getConstant("LOADING_TEXT") : "Submit"}
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
