"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppContext } from "@/contextProvider";
import CommonModal from "@/components/common/commonModal";
import style from "@/styles/coupon/coupon.module.scss";
import { Country, State, City } from "country-state-city";
import commonStyle from "@/css/common/common.module.scss";

import {
  convertDateToISO,
  formatDateOnly,
  formatIndianNumber,
} from "@/utils/utils";

const getPreviewType = (name = "", mimeType = "") => {
  const normalizedMimeType = String(mimeType || "").toLowerCase();
  const normalizedName = String(name || "").toLowerCase();

  if (normalizedMimeType.startsWith("image/")) {
    return normalizedMimeType;
  }

  if (normalizedMimeType === "application/pdf") {
    return "application/pdf";
  }

  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(normalizedName)) {
    return "image/*";
  }

  if (normalizedName.endsWith(".pdf")) {
    return "application/pdf";
  }

  return "";
};

const getFirstPreviewableExistingDocument = (documents = []) =>
  documents.find((documentItem) =>
    Boolean(
      getPreviewType(
        documentItem?.title || documentItem?.s3_path,
        documentItem?.type,
      ),
    ),
  );

export default function TenderModificationEditForm({
  tenderDetails,
  tenderQcId,
  updateTenderModification,
  catData,
  financierList,
  sourceTag,
  requiredDoc,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { showAlert } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dataEdited, setDataEdited] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    tenderDetails?.tender_country || "",
  );
  const [selectedState, setSelectedState] = useState(
    tenderDetails?.tender_state || "",
  );
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories] = useState(catData || []);
  const [subcategories, setSubcategories] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState(
    Array.isArray(tenderDetails?.tender_documents_path)
      ? tenderDetails.tender_documents_path
      : [],
  );
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [documentPreview, setDocumentPreview] = useState(null);
  const requiredDocumentOptions = Array.isArray(requiredDoc?.list)
    ? requiredDoc.list
    : [];
  const normalizeRequiredDocuments = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        if (item && typeof item === "object" && item.id) {
          return item;
        }

        if (typeof item === "string") {
          return (
            requiredDocumentOptions.find(
              (option) => option.name.toLowerCase() === item.toLowerCase(),
            ) || null
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  const defaultFormData = {
    tender_number: tenderDetails?.tender_number || "",
    source_tag: tenderDetails?.source_tag || "",
    tender_type: tenderDetails?.tender_type || "",
    tender_category: tenderDetails?.tender_category || "",
    tender_title:
      tenderDetails?.llm_extracted_data?.basic_info?.generated_title ||
      tenderDetails?.tender_title ||
      "",
    tender_description:
      tenderDetails?.llm_extracted_data?.basic_info?.summary ||
      tenderDetails?.tender_description ||
      "",
    tender_city: tenderDetails?.tender_city || "",
    tender_state: tenderDetails?.tender_state || "",
    tender_country: tenderDetails?.tender_country || "",
    tender_financier: tenderDetails?.tender_financier || "",
    tender_organisation: tenderDetails?.tender_organisation || "",
    tender_purchaser_address: tenderDetails?.tender_purchaser_address || "",
    tender_end_date: formatDateOnly(tenderDetails?.tender_end_date),
    tender_emd: tenderDetails?.tender_emd || "",
    tender_bidding_type: tenderDetails?.tender_bidding_type || "",
    tender_value: tenderDetails?.tender_value || "",
    tender_start_date: formatDateOnly(tenderDetails?.tender_start_date),
    tender_publishing_date: formatDateOnly(
      tenderDetails?.tender_publishing_date,
    ),
    tender_purchaser_name: tenderDetails?.tender_purchaser_name || tenderDetails?.tender_organisation || "",
    tender_pincode: tenderDetails?.tender_pincode || "",
    tender_email_id: tenderDetails?.tender_email_id || "",
    tender_website: tenderDetails?.tender_website || "",
    tender_contract_type: tenderDetails?.tender_contract_type || "",
    tender_evaluation:
      tenderDetails?.llm_extracted_data?.commercial?.evaluation_method ||
      tenderDetails?.llm_extracted_data?.basic_info?.evaluation_method ||
      "",
    tender_procurement_process:
      tenderDetails?.llm_extracted_data?.commercial?.type_of_bid || "",
    tender_contact_person:
      (tenderDetails?.llm_extracted_data?.schedules &&
        tenderDetails?.llm_extracted_data?.schedules[0]?.consignee_details[0]
          ?.reporting_officer) ||
      "",
    tender_contract_period:
      (tenderDetails?.llm_extracted_data?.timeline &&
        tenderDetails?.llm_extracted_data?.timeline?.bid_offer_validity_days) ||
      "",
    estimated_bid_value:
      formatIndianNumber(
        tenderDetails?.llm_extracted_data?.financial?.estimated_bid_value
          ?.amount,
      ) || "",
    main_category:
      tenderDetails?.llm_extracted_data?.basic_info?.main_category || "",
    sub_category:
      tenderDetails?.llm_extracted_data?.basic_info?.sub_category || "",
    tender_ministry_name:
      tenderDetails?.llm_extracted_data?.organization?.ministry ||
      tenderDetails?.tender_ministry_name ||
      "",
    department:
      tenderDetails?.llm_extracted_data?.organization?.department || "",
    tender_office_name:
      tenderDetails?.llm_extracted_data?.organization?.office_name || "",
    required_documents: normalizeRequiredDocuments(
      tenderDetails?.required_documents ||
        tenderDetails?.llm_extracted_data?.eligibility?.documents_required,
    ),
  };
  // const sourceTagOptions = Array.isArray(sourceTag?.list) ? sourceTag.list : [];
  const [formData, setFormData] = useState(defaultFormData);
  const financierData = Array.isArray(financierList?.list)
    ? financierList.list
    : [];

  const getS3Url = (path) => {
    if (!path) return "#";

    const bucketUrl = "https://tender-bharo-tender-documents.s3.amazonaws.com/";

    if (path.startsWith("s3://tender-bharo-tender-documents/")) {
      return path.replace("s3://tender-bharo-tender-documents/", bucketUrl);
    }

    if (path.startsWith("tender_documents")) {
      return bucketUrl + path;
    }

    return path;
  };

  const openSelectedDocumentPreview = (file) => {
    const previewType = getPreviewType(file?.name, file?.type);

    if (!file || !previewType) {
      setDocumentPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setDocumentPreview({
      name: file.name,
      type: previewType,
      url: previewUrl,
      revokeOnCleanup: true,
    });
  };

  const openExistingDocumentPreview = (documentItem) => {
    const documentUrl = getS3Url(documentItem?.s3_path);
    const previewType = getPreviewType(
      documentItem?.title || documentItem?.s3_path,
      documentItem?.type,
    );

    if (!previewType) {
      setDocumentPreview(null);
      return;
    }

    setDocumentPreview({
      name: documentItem?.title || "Document",
      type: previewType,
      url: documentUrl,
      revokeOnCleanup: false,
    });
  };

  useEffect(() => {
    if (!catData || !tenderDetails) return;

    const mainCategory =
      tenderDetails?.llm_extracted_data?.basic_info?.main_category;

    const subCategory =
      tenderDetails?.llm_extracted_data?.basic_info?.sub_category;

    const matched = catData.find(
      (c) => c.category.toLowerCase() === mainCategory?.toLowerCase(),
    );

    if (!matched) return;

    setSubcategories(matched.subcategories);

    setFormData((prev) => ({
      ...prev,
      main_category: matched.category,
      sub_category: subCategory || "",
    }));

    setValue("main_category", matched.category);
    setValue("sub_category", subCategory || "");
  }, [catData, tenderDetails]);

  useEffect(() => {
    const initialPreviewDocument =
      getFirstPreviewableExistingDocument(existingDocuments);

    if (initialPreviewDocument) {
      openExistingDocumentPreview(initialPreviewDocument);
    } else {
      setDocumentPreview(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (documentPreview?.revokeOnCleanup && documentPreview?.url) {
        URL.revokeObjectURL(documentPreview.url);
      }
    };
  }, [documentPreview]);

  const validation = {
    tender_number: register("tender_number", {
      required: "Tender number is required",
    }),
    tender_bidding_type: register("tender_bidding_type", {
      required: "Tender bidding type is required",
    }),
    tender_title: register("tender_title", {
      required: "Tender title is required",
    }),
    tender_description: register("tender_description", {
      required: "Tender description is required",
    }),
    tender_organisation: register("tender_organisation"),
    main_category: register("main_category", {
      required: "Main category is required",
    }),
    sub_category: register("sub_category", {
      required: "Sub category is required",
    }),
    tender_start_date: register("tender_start_date", {
      required: "Tender start date is required",
    }),
    tender_publishing_date: register("tender_publishing_date"),
    tender_end_date: register("tender_end_date", {
      required: "Tender closing date is required",
    }),
    tender_purchaser_address: register("tender_purchaser_address", {
      required: "Tender purchaser address is required",
    }),
    tender_purchaser_name: register("tender_purchaser_name", {
      required: "Tender purchaser name is required",
    }),
    tender_country: register("tender_country", {
      required: "Tender country is required",
    }),
    tender_state: register("tender_state", {
      required: "Tender state is required",
    }),
    tender_financier: register("tender_financier", {
      required: "Tender financier is required",
    }),
    document: register("document", {
      validate: () =>
        existingDocuments.length > 0 || selectedDocuments.length > 0
          ? true
          : "At least one document is required",
    }),
  };

  const handleRequiredDocumentChange = (documentItem, isChecked) => {
    const currentDocuments = Array.isArray(formData.required_documents)
      ? formData.required_documents
      : [];

    const nextDocuments = isChecked
      ? [...currentDocuments, documentItem]
      : currentDocuments.filter((item) => item?.id !== documentItem.id);

    setFormData((prev) => ({
      ...prev,
      required_documents: nextDocuments,
    }));
    setValue("required_documents", nextDocuments);
    setDataEdited(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);
    setValue(name, value);
    setDataEdited(true);
  };

  const handleFormSubmit = async () => {
    if (!dataEdited) {
      showAlert("No changes made", 2);
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();
      const normalizedFormData = {
        ...formData,
        tender_start_date: convertDateToISO(formData.tender_start_date),
        tender_end_date: convertDateToISO(formData.tender_end_date),
        tender_publishing_date: convertDateToISO(
          formData.tender_publishing_date,
        ),
      };

      payload.append("id", tenderQcId);
      Object.entries(normalizedFormData).forEach(([key, value]) => {
        if (key === "required_documents") {
          payload.append(key, JSON.stringify(value || []));
          return;
        }

        payload.append(key, value ?? "");
      });
      payload.append(
        "retained_documents",
        JSON.stringify(existingDocuments || []),
      );

      selectedDocuments.forEach((file) => {
        payload.append("document", file);
      });

      const result = await updateTenderModification(payload);

      if (result?.success) {
        showAlert("Tender modification updated successfully", 1);
        router.push("/tender-modification");
        router.refresh();
      } else {
        showAlert(
          result?.error ||
            result?.message ||
            "Failed to update tender modification",
          2,
        );
      }
    } catch (error) {
      console.error("Error updating tender modification:", error);
      showAlert("Error updating tender modification", 2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setSelectedDocuments(files);
    setFileNames(files.map((file) => file.name));
    setValue("document", files.length ? "selected" : "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    if (files.length > 0) {
      clearErrors("document");
    }
    const previewableFile = files.find((file) =>
      Boolean(getPreviewType(file?.name, file?.type)),
    );

    if (previewableFile) {
      openSelectedDocumentPreview(previewableFile);
    } else {
      setDocumentPreview(null);
    }
    setDataEdited(true);
  };

  const handleExistingDocumentDelete = (indexToRemove) => {
    const nextDocuments = existingDocuments.filter(
      (_, index) => index !== indexToRemove,
    );
    const removedDocument = existingDocuments[indexToRemove];
    const removedDocumentUrl = getS3Url(removedDocument?.s3_path);

    setExistingDocuments(nextDocuments);
    if (documentPreview?.url && documentPreview.url === removedDocumentUrl) {
      const nextPreviewDocument =
        getFirstPreviewableExistingDocument(nextDocuments);

      if (nextPreviewDocument) {
        openExistingDocumentPreview(nextPreviewDocument);
      } else {
        const nextPreviewFile = selectedDocuments.find((file) =>
          Boolean(getPreviewType(file?.name, file?.type)),
        );

        if (nextPreviewFile) {
          openSelectedDocumentPreview(nextPreviewFile);
        } else {
          setDocumentPreview(null);
        }
      }
    }
    setValue(
      "document",
      nextDocuments.length || selectedDocuments.length ? "selected" : "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
    setDataEdited(true);
  };

  const handleSelectedDocumentDelete = (indexToRemove) => {
    const nextDocuments = selectedDocuments.filter(
      (_, index) => index !== indexToRemove,
    );
    const removedDocument = selectedDocuments[indexToRemove];

    setSelectedDocuments(nextDocuments);
    setFileNames(nextDocuments.map((file) => file.name));
    if (documentPreview?.name === removedDocument?.name) {
      const nextPreviewFile = nextDocuments.find((file) =>
        Boolean(getPreviewType(file?.name, file?.type)),
      );

      if (nextPreviewFile) {
        openSelectedDocumentPreview(nextPreviewFile);
      } else {
        const nextPreviewDocument =
          getFirstPreviewableExistingDocument(existingDocuments);

        if (nextPreviewDocument) {
          openExistingDocumentPreview(nextPreviewDocument);
        } else {
          setDocumentPreview(null);
        }
      }
    }
    setValue(
      "document",
      nextDocuments.length || existingDocuments.length ? "selected" : "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
    setDataEdited(true);
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirmModal(true);
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitConfirmModal(false);
    await handleFormSubmit();
  };

  const handleCategoryChange = (category) => {
    const selected = categories.find((c) => c.category === category);

    setSubcategories(selected?.subcategories || []);

    setFormData((prev) => ({
      ...prev,
      main_category: category,
      sub_category: "",
    }));

    setValue("main_category", category);
    setValue("sub_category", "");

    setDataEdited(true);
  };
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountryData = Country.getAllCountries().find(
      (country) => country.isoCode === countryCode,
    );

    setSelectedCountry(countryCode);
    setSelectedState("");
    setCities([]);

    const stateList = State.getStatesOfCountry(countryCode);
    setStates(stateList);

    setFormData((prev) => ({
      ...prev,
      tender_country: selectedCountryData?.name || "",
      tender_state: "",
      tender_city: "",
    }));

    setValue("tender_country", selectedCountryData?.name || "");
    setValue("tender_state", "");
    setValue("tender_city", "");
    clearErrors(["tender_country", "tender_state"]);
    setDataEdited(true);
  };
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedStateData = states.find(
      (state) => state.isoCode === stateCode,
    );

    setSelectedState(stateCode);

    const cityList = City.getCitiesOfState(selectedCountry, stateCode);
    setCities(cityList);

    setFormData((prev) => ({
      ...prev,
      tender_state: selectedStateData?.name || "",
      tender_city: "",
    }));

    setValue("tender_state", selectedStateData?.name || "");
    setValue("tender_city", "");
    clearErrors("tender_state");
    setDataEdited(true);
  };
  const handleCityChange = (e) => {
    const cityName = e.target.value;

    setFormData((prev) => ({
      ...prev,
      tender_city: cityName,
    }));

    setValue("tender_city", cityName);
    setDataEdited(true);
  };
  const getCountryCode = (countryName) => {
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName?.toLowerCase(),
    );

    return country?.isoCode || "";
  };

  useEffect(() => {
    if (!tenderDetails?.tender_country) return;

    const countryCode = getCountryCode(tenderDetails.tender_country);
    if (!countryCode) return;

    setSelectedCountry(countryCode);

    const stateList = State.getStatesOfCountry(countryCode);
    setStates(stateList);

    if (!tenderDetails?.tender_state) return;

    const state = stateList.find(
      (s) => s.name.toLowerCase() === tenderDetails.tender_state.toLowerCase(),
    );

    if (!state) return;

    setSelectedState(state.isoCode);

    const cityList = City.getCitiesOfState(countryCode, state.isoCode);
    setCities(cityList);

    if (!tenderDetails?.tender_city) return;

    const city = cityList.find(
      (c) => c.name.toLowerCase() === tenderDetails.tender_city.toLowerCase(),
    );

    if (city) {
      setFormData((prev) => ({
        ...prev,
        tender_city: city.name,
      }));

      setValue("tender_city", city.name);
    }
  }, [tenderDetails, setValue]);
  const contractType = [
    "Tender Notice",
    "Expression of Interest",
    "Contract Award",
    "Procurement Plan",
  ];
  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className={style.couponRow + " " + "col-md-12 mb-1"}>
                    <label>Upload Documents</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...validation.document}
                        value={
                          existingDocuments.length || selectedDocuments.length
                            ? "selected"
                            : ""
                        }
                        readOnly
                      />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className={commonStyle.formControl}
                      />
                      {errors.document && (
                        <span className={commonStyle.errorText}>
                          {errors.document.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    {existingDocuments?.length > 0 && (
                      <ul style={{ marginBottom: "8px" }}>
                        {existingDocuments.map((doc, index) => (
                          <li key={index}>
                            <button
                              type="button"
                              onClick={() => openExistingDocumentPreview(doc)}
                              style={{
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                color: "#2563eb",
                                textDecoration: "underline",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              {doc.title || `Document ${index + 1}`}
                            </button>
                            <span
                              onClick={() =>
                                handleExistingDocumentDelete(index)
                              }
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "18px",
                                height: "18px",
                                marginLeft: "8px",
                                borderRadius: "999px",
                                background: "#fee2e2",
                                color: "#b91c1c",
                                fontSize: "12px",
                                fontWeight: "700",
                                lineHeight: "1",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {fileNames.length > 0 && (
                      <ul style={{ marginBottom: "8px" }}>
                        {fileNames.map((name, index) => (
                          <li key={`${name}-${index}`}>
                            <button
                              type="button"
                              onClick={() =>
                                openSelectedDocumentPreview(
                                  selectedDocuments[index],
                                )
                              }
                              style={{
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                color: "#2563eb",
                                textDecoration: "underline",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              {name}
                              <span
                                onClick={() =>
                                  handleSelectedDocumentDelete(index)
                                }
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "18px",
                                  height: "18px",
                                  marginLeft: "8px",
                                  borderRadius: "999px",
                                  background: "#fee2e2",
                                  color: "#b91c1c",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  lineHeight: "1",
                                  cursor: "pointer",
                                }}
                              >
                                X
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Reference Number
                      <span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_number"
                        name="tender_number"
                        {...validation.tender_number}
                        value={formData.tender_number}
                        onChange={handleInputChange}
                        placeholder="Tender Reference Number"
                        className={commonStyle.formControl}
                      />
                      {errors.tender_number && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_number.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Closing Date
                      <span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="date"
                        name="tender_end_date"
                        className={commonStyle.formControl}
                        {...validation.tender_end_date}
                        value={formData.tender_end_date}
                        onChange={handleInputChange}
                        placeholder="Tender Closing Date"
                      />
                      {errors.tender_end_date && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_end_date.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Start Date<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="date"
                        name="tender_start_date"
                        className={commonStyle.formControl}
                        {...validation.tender_start_date}
                        value={formData.tender_start_date}
                        onChange={handleInputChange}
                        placeholder="Tender Start Date"
                      />
                      {errors.tender_start_date && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_start_date.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Publishing Date</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="date"
                        name="tender_publishing_date"
                        className={commonStyle.formControl}
                        {...validation.tender_publishing_date}
                        value={formData.tender_publishing_date}
                        onChange={handleInputChange}
                        placeholder="Tender Publishing Date"
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-12"}>
                    <label>
                      Tender Title<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_title"
                        name="tender_title"
                        {...validation.tender_title}
                        value={formData.tender_title}
                        onChange={handleInputChange}
                        placeholder="Enter tender title"
                        className={commonStyle.formControl}
                      />
                      {errors.tender_title && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_title.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-12"}>
                    <label>
                      Tender Description<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <textarea
                        type="text"
                        id="tender_description"
                        name="tender_description"
                        {...validation.tender_description}
                        value={formData.tender_description}
                        onChange={handleInputChange}
                        className={commonStyle.formControl}
                        placeholder="Enter tender description"
                      />
                      {errors.tender_description && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_description.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Purchaser Name
                      <span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_purchaser_name"
                        className={commonStyle.formControl}
                        placeholder="Tender Purchaser Name"
                        {...validation.tender_purchaser_name}
                        value={formData.tender_purchaser_name}
                        onChange={handleInputChange}
                      />
                      {errors.tender_purchaser_name && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_purchaser_name.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Ministry Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_ministry_name"
                        className={commonStyle.formControl}
                        placeholder="Tender Ministry Name"
                        value={formData.tender_ministry_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-12"}>
                    <label>
                      Tender Purchaser Address
                      <span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <textarea
                        rows={2}
                        name="tender_purchaser_address"
                        className={commonStyle.formControl}
                        placeholder="Tender Purchaser Address"
                        {...validation.tender_purchaser_address}
                        value={formData.tender_purchaser_address}
                        onChange={handleInputChange}
                      />
                      {errors.tender_purchaser_address && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_purchaser_address.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Email</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="email"
                        name="tender_email_id"
                        className={commonStyle.formControl}
                        placeholder="Tender Email"
                        value={formData.tender_email_id}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Website</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_website"
                        placeholder="Tender Website"
                        className={commonStyle.formControl}
                        value={formData.tender_website}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Tender Country<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...validation.tender_country}
                        value={formData.tender_country}
                        readOnly
                      />
                      <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select Country</option>

                        {Country.getAllCountries().map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.tender_country && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_country.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Tender State<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...validation.tender_state}
                        value={formData.tender_state}
                        readOnly
                      />
                      <select
                        value={selectedState}
                        onChange={handleStateChange}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select State</option>

                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.tender_state && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_state.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Tender City</label>
                    <div className={style.inputsWrap}>
                      <select
                        value={formData.tender_city}
                        onChange={handleCityChange}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select City</option>

                        {cities.map((city, index) => (
                          <option key={index} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Main Category<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <select
                        {...validation.main_category}
                        value={formData.main_category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select Category</option>

                        {categories.map((cat, index) => (
                          <option key={index} value={cat.category}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                      {errors.main_category && (
                        <span className={commonStyle.errorText}>
                          {errors.main_category.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Sub Category<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <select
                        {...validation.sub_category}
                        value={formData.sub_category}
                        onChange={handleInputChange}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select Sub Category</option>

                        {subcategories.map((sub, index) => (
                          <option key={index} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                      {errors.sub_category && (
                        <span className={commonStyle.errorText}>
                          {errors.sub_category.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Tender Category</label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_category"
                        className={commonStyle.formControl}
                        value={formData.tender_category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Tender Category</option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                        <option value="Work">Work</option>
                      </select>
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Value</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="number"
                        name="tender_value"
                        className={commonStyle.formControl}
                        placeholder="Tender Value"
                        value={formData.tender_value}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender EMD</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_emd"
                        placeholder="Tender EMD"
                        className={commonStyle.formControl}
                        value={formData.tender_emd}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Bidding Type</label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_bidding_type"
                        className={commonStyle.formControl}
                        {...validation.tender_bidding_type}
                        value={formData.tender_bidding_type}
                        onChange={handleInputChange}
                      >
                        <option value="NCB">NCB</option>
                        <option value="ICB">ICB</option>
                      </select>
                      {errors.tender_bidding_type && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_bidding_type.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Tender Type</label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_type"
                        className={commonStyle.formControl}
                        value={formData.tender_type}
                        onChange={handleInputChange}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="LIMITED">LIMITED</option>
                      </select>
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Tender Financier<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_financier"
                        {...validation.tender_financier}
                        value={formData.tender_financier}
                        onChange={handleInputChange}
                        className={commonStyle.formControl}
                      >
                        <option value="Self Financier">Self Financier</option>
                        {financierData.map((v, i) => (
                          <option key={i + 1} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                      {errors.tender_financier && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_financier.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Contract Type</label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_contract_type"
                        className={commonStyle.formControl}
                        value={formData.tender_contract_type}
                        onChange={handleInputChange}
                      >
                        <option value="Tender Notice">Tender Notice</option>
                        {contractType.map((v, i) => (
                          <option key={i + 1} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Evaluation</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_evaluation"
                        name="tender_evaluation"
                        placeholder="Tender Evaluation"
                        className={commonStyle.formControl}
                        value={formData.tender_evaluation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Procurement Process</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        className={commonStyle.formControl}
                        id="tender_procurement_process"
                        name="tender_procurement_process"
                        placeholder="Tender Procurement Process"
                        value={formData.tender_procurement_process}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Contact Person</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        className={commonStyle.formControl}
                        id="tender_contact_person"
                        name="tender_contact_person"
                        placeholder="Tender Contact Person"
                        value={formData.tender_contact_person}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Tender Contract Period</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_contract_period"
                        className={commonStyle.formControl}
                        name="tender_contract_period"
                        placeholder="Tender Contract Period"
                        value={formData.tender_contract_period}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Source Tag</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="source_tag"
                        placeholder="Source Tag"
                        className={commonStyle.formControl}
                        value={formData.source_tag}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Office Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        className={commonStyle.formControl}
                        id="tender_office_name"
                        name="tender_office_name"
                        value={formData.tender_office_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}

                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Organisation</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_organisation"
                        className={commonStyle.formControl}
                        name="tender_organisation"
                        placeholder="Department / Organization"
                        value={formData.tender_organisation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Department</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        placeholder="Tender Office Name"
                        className={commonStyle.formControl}
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Pincode</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_pincode"
                        className={commonStyle.formControl}
                        placeholder="Tender Pincode"
                        value={formData.tender_pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}

                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Estimated Bid Value</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="estimated_bid_value"
                        className={commonStyle.formControl}
                        placeholder="Estimated Bid Value"
                        value={formData.estimated_bid_value}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div> */}
                  {requiredDocumentOptions.length > 0 && (
                    <div className={style.couponRow + " " + "col-md-12"}>
                      <label>Required Documents</label>
                      <div className={style.inputsWrap}>
                        <div className={style.requiredDocumentGroup}>
                          {requiredDocumentOptions.map((item) => {
                            const isChecked = (
                              formData.required_documents || []
                            ).some(
                              (selectedItem) => selectedItem?.id === item.id,
                            );

                            return (
                              <div
                                key={item.id}
                                className={style.requiredDocumentItem}
                              >
                                <input
                                  type="checkbox"
                                  id={`required-document-${item.id}`}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleRequiredDocumentChange(
                                      item,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <div htmlFor={`required-document-${item.id}`}>
                                  {item.name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                {documentPreview ? (
                  <div
                    className={style.couponRow}
                    style={{ position: "sticky", top: "80px" }}
                  >
                    <label>Document Preview</label>
                    <div className={style.inputsWrap}>
                      {documentPreview.type.startsWith("image/") && (
                        <img
                          src={documentPreview.url}
                          alt={documentPreview.name}
                          style={{
                            maxWidth: "200px",
                            width: "100%",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      {documentPreview.type === "application/pdf" && (
                        <iframe
                          src={documentPreview.url}
                          title={`Preview of ${documentPreview.name}`}
                          width="100%"
                          height="400"
                          style={{
                            border: "1px solid #d8dee9",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={style.nopreview}></div>
                )}
              </div>
            </div>
          </form>
          <div className={commonStyle.formBtnWrap}>
            <button
              type="button"
              disabled={isLoading || !dataEdited}
              className={commonStyle.commonBtn}
              onClick={handleSubmit(handleSubmitClick)}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/tender-modification")}
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <CommonModal
        show={showSubmitConfirmModal}
        handleClose={() => !isLoading && setShowSubmitConfirmModal(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to save these tender modification changes?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              className={commonStyle.commonBtn}
              onClick={handleSubmitConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "YES"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setShowSubmitConfirmModal(false)}
              disabled={isLoading}
            >
              NO
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
