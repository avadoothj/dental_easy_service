"use client";

import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import { getConstant } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/css/coupon/coupon.module.scss";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import commonStyle from "@/css/common/common.module.scss";

const defaultFormData = {
  url_link: "",
  country: "",
  groups: "",
  notice_type: "",
  visit_priority: "",
  process_type: "webpage",
  is_vpn: false,
};

export default function AddLinkForm({
  initialData = defaultFormData,
  mode = "add",
  isModal = false,
  onSuccess,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { showAlert } = useContext(AppContext);
  const router = useRouter();
  const inputMaxLength = getConstant("INPUT_MAXLENGTH");
  const isEditMode = mode === "edit";
  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [isLoading, setIsLoading] = useState(false);

  const formValidation = {
    url_link: register("url_link", {
      required: "Please enter link",
      pattern: {
        value: /^https?:\/\/.+/i,
        message: "Please enter valid URL",
      },
    }),
    country: register("country", {
      required: "Please select country",
    }),
    groups: register("groups"),
    notice_type: register("notice_type"),
    visit_priority: register("visit_priority"),
    process_type: register("process_type"),
  };

  const updateSelectedForm = (key, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
  };

  useEffect(() => {
    const nextFormData = { ...defaultFormData, ...initialData };
    setFormData(nextFormData);
    reset(nextFormData);
  }, [initialData, reset]);

  const submitLinkForm = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/webPageWatcher/addLink", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initialData?.id,
          ...formData,
          url_link: formData.url_link.trim(),
          country: formData.country.trim(),
          groups: formData.groups.trim(),
          notice_type: formData.notice_type.trim(),
          visit_priority: formData.visit_priority.toString().trim(),
          process_type: formData.process_type.trim(),
        }),
      });

      const result = await response.json();

      if (result.status) {
        const successMessage = result.message || (isEditMode ? "Link updated successfully" : "Link added successfully");
        showAlert(successMessage, 1);

        if (isEditMode) {
          onSuccess?.({ ...formData, id: initialData?.id }, successMessage);
          return;
        }

        setFormData(defaultFormData);
        reset(defaultFormData);
        onSuccess?.(defaultFormData, successMessage);
        router.push("/site-visit");
      } else {
        showAlert(result.message || messages.SERVER_ERROR);
      }
    } catch (error) {
      showAlert(messages.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    if (isEditMode && onSuccess) {
      onSuccess({ ...formData, id: initialData?.id });
      return;
    }

    await submitLinkForm();
  };

  const CountryData = Country.getAllCountries().map((country) => ({
    id: country.name,
    label: `${country.name}`,
  }));

  const GroupData = [
    { id: "group A", label: "Group A" },
    { id: "group B", label: "Group B" },
    { id: "group C", label: "Group C" },
    { id: "group D", label: "Group D" },
    { id: "group E", label: "Group E" },
  ];

  const NoticeTypeData = [
    { id: "tender_notice", label: "Tender Notice" },
    { id: "contract_award", label: "Contract Award" },
    { id: "procurement_plan", label: "Procurement Plan" },
    { id: "project", label: "Project" },
  ];

  const ProcessTypeData = [
    { id: "scraper", label: "Scraper" },
    { id: "crawler", label: "Crawler" },
    { id: "manual", label: "Manual" },
  ];

  const formContent = (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="row">
        <div className={style.couponRow + " " + "col-md-4"}>
          <label>
            Link <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div className={style.inputsWrap}>
            <input
              {...formValidation.url_link}
              type="text"
              placeholder="Enter Tender Link"
              maxLength={inputMaxLength}
              value={formData.url_link}
              className={commonStyle.formControl}
              onChange={(e) => {
                formValidation.url_link.onChange(e);
                updateSelectedForm("url_link", e.target.value);
              }}
            />
            {errors.url_link && (
              <span className={commonStyle.errorText}>
                {errors.url_link?.message}
              </span>
            )}
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>
            Country <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div className={style.customselect2}>
            <select
              className={commonStyle.formControl}
              {...formValidation.country}
              value={formData.country}
              onChange={(e) => {
                formValidation.country.onChange(e);
                updateSelectedForm("country", e.target.value);
              }}
            >
              <option value="">-- Select --</option>
              {CountryData.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className={commonStyle.errorText}>
                {errors.country?.message}
              </span>
            )}
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>Groups</label>
          <div className={style.customselect2}>
            <select
              className={commonStyle.formControl}
              {...formValidation.groups}
              value={formData.groups}
              onChange={(e) => {
                formValidation.groups.onChange(e);
                updateSelectedForm("groups", e.target.value);
              }}
            >
              <option value="">-- Select --</option>
              {GroupData.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>Notice Type</label>
          <div className={style.customselect2}>
            <select
              className={commonStyle.formControl}
              {...formValidation.notice_type}
              value={formData.notice_type}
              onChange={(e) => {
                formValidation.notice_type.onChange(e);
                updateSelectedForm("notice_type", e.target.value);
              }}
            >
              <option value="">-- Select --</option>
              {NoticeTypeData.map((notice) => (
                <option key={notice.id} value={notice.id}>
                  {notice.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>Visit Priority</label>
          <div className={style.customselect2}>
            <select
              className={commonStyle.formControl}
              {...formValidation.visit_priority}
              value={formData.visit_priority}
              onChange={(e) => {
                formValidation.visit_priority.onChange(e);
                updateSelectedForm("visit_priority", e.target.value);
              }}
            >
              <option value="">-- Select --</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>Process Type</label>
          <div className={style.customselect2}>
            <select
              className={commonStyle.formControl}
              {...formValidation.process_type}
              value={formData.process_type}
              onChange={(e) => {
                formValidation.process_type.onChange(e);
                updateSelectedForm("process_type", e.target.value);
              }}
            >
              <option value="">-- Select --</option>
              {ProcessTypeData.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={style.couponRow + " " + "col-md-4"}>
          <label>VPN Access</label>
          <div className={style.inputsWrap}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                checked={formData.is_vpn}
                onChange={(e) => {
                  updateSelectedForm("is_vpn", e.target.checked);
                }}
              />
              Is VPN
            </label>
          </div>
        </div>
        <div className={commonStyle.formBtnWrap}>
          <button
            type="submit"
            className={commonStyle.commonBtn}
            disabled={isLoading}
          >
            {isLoading ? getConstant("LOADING_TEXT") : isEditMode ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            className={commonStyle.commonBtn + " " + commonStyle.stroke}
            onClick={() => {
              if (isModal) {
                onCancel?.();
                return;
              }
              router.push("/site-visit");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );

  return (
    <>
      <div className={isModal ? "" : style.assignCoupon}>
        <div className={style.inner}>
          <div className={style.assignCouponForm}>
            {formContent}
          </div>
        </div>
      </div>
    </>
  );
}
