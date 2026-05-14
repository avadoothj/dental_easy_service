"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

import { AppContext } from "@/contextProvider";
import CommonModal from "@/components/common/commonModal";
import style from "@/styles/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";

import { addTender, updateTenderById } from "../../controllers/tender";
import { formatDate, formatDateOnly } from "@/utils/utils";

const INITIAL_FORM_DATA = {
  tender_number: "",
  source_tag: "",
  tender_title: "",
  tender_description: "",
  // tender_organisation: "",
  // tender_office_name: "",
  department: "",
  ministry_name: "",
  tender_bidding_type: "NCB",
  main_category: "",
  sub_category: "",
  tender_value: "",
  tender_start_date: "",
  tender_publishing_date: "",
  tender_end_date: "",
  tender_purchaser_address: "",
  tender_purchaser_name: "",
  tender_country: "",
  tender_state: "",
  tender_city: "",
  // tender_pincode: "",
  tender_financier: "Self Financier",
  tender_email_id: "",
  tender_website: "",
  tender_emd: "",
  // estimated_bid_value: "",
  tender_type: "OPEN",
  tender_contract_type: "",
  tender_category: "",
  tender_evaluation: "L1 Ranking",
  tender_procurement_process: "Electronic Documents, First(One Cover)",
  tender_contact_person: "",
  tender_contract_period: "",
  rejection_reason: "",
  required_documents: [],
  document: [],
};

const getCountryCodeByName = (countryName) => {
  if (!countryName) {
    return "";
  }

  const country = Country.getAllCountries().find(
    (item) => item.name.toLowerCase() === countryName.toLowerCase(),
  );

  return country?.isoCode || "";
};

const getStateCodeByName = (countryCode, stateName) => {
  if (!countryCode || !stateName) {
    return "";
  }

  const state = State.getStatesOfCountry(countryCode).find(
    (item) => item.name.toLowerCase() === stateName.toLowerCase(),
  );

  return state?.isoCode || "";
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

const mapTenderToFormData = (tenderDetails = {}) => ({
  ...INITIAL_FORM_DATA,
  tender_number: tenderDetails?.tender_number ?? "",
  source_tag: tenderDetails?.source_tag ?? "",
  tender_title: tenderDetails?.tender_title ?? "",
  tender_description: tenderDetails?.tender_description ?? "",
  // tender_organisation: tenderDetails?.tender_organisation ?? "",
  department: tenderDetails?.department ?? "",
  ministry_name: tenderDetails?.tender_ministry_name ?? "",
  // tender_office_name: tenderDetails?.tender_contact_person ?? "",
  tender_bidding_type:
    tenderDetails?.tender_bidding_type ?? INITIAL_FORM_DATA.tender_bidding_type,
  main_category: tenderDetails?.main_category ?? "",
  sub_category: tenderDetails?.sub_category ?? "",
  tender_value: tenderDetails?.tender_value ?? "",
  tender_start_date: formatDateOnly(tenderDetails?.tender_start_date),
  tender_publishing_date: formatDateOnly(tenderDetails?.tender_publishing_date),
  tender_end_date: formatDateOnly(tenderDetails?.tender_end_date),
  tender_purchaser_address: tenderDetails?.tender_purchaser_address ?? "",
  tender_purchaser_name: tenderDetails?.tender_purchaser_name ?? "",
  tender_country: tenderDetails?.tender_country ?? "",
  tender_state: tenderDetails?.tender_state ?? "",
  tender_city: tenderDetails?.tender_city ?? "",
  // tender_pincode: tenderDetails?.tender_pincode ?? "",
  tender_financier:
    tenderDetails?.tender_financier ?? INITIAL_FORM_DATA.tender_financier,
  tender_email_id: tenderDetails?.tender_email_id ?? "",
  tender_website: tenderDetails?.tender_website ?? "",
  tender_emd: tenderDetails?.tender_emd ?? "",
  // estimated_bid_value: tenderDetails?.estimated_bid_value ?? "",
  tender_type: tenderDetails?.tender_type ?? INITIAL_FORM_DATA.tender_type,
  tender_contract_type: tenderDetails?.tender_contract_type ?? "",
  tender_category: tenderDetails?.tender_category ?? "",
  tender_evaluation:
    tenderDetails?.tender_evaluation ?? INITIAL_FORM_DATA.tender_evaluation,
  tender_procurement_process:
    tenderDetails?.tender_procurement_process ??
    INITIAL_FORM_DATA.tender_procurement_process,
  tender_contact_person: tenderDetails?.tender_contact_person ?? "",
  tender_contract_period: tenderDetails?.tender_contract_period ?? "",
  required_documents: Array.isArray(tenderDetails?.required_documents)
    ? tenderDetails.required_documents
    : [],
  document: [],
  rejection_reason: tenderDetails?.rejection_reason ?? "",
});

export default function TenderForm({
  categories = [],
  initialData = null,
  tenderId = "",
  isAllow = false,
  requiredDoc,
  financierList,
}) {
  const isEditMode = Boolean(tenderId);
  const router = useRouter();
  const {
    register,
    clearErrors,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...INITIAL_FORM_DATA,
      document: "",
    },
  });

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const { showAlert } = useContext(AppContext);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubmitAction, setActiveSubmitAction] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [readyForApproval, setReadyForApproval] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [documentPreview, setDocumentPreview] = useState(null);
  const selectedDocuments = Array.isArray(formData.document)
    ? formData.document
    : [];
  const requiredDocumentOptions = Array.isArray(requiredDoc?.list)
    ? requiredDoc.list
    : [];
  const financierData = Array.isArray(financierList?.list)
    ? financierList.list
    : [];
  const countries = Country.getAllCountries();
  useEffect(() => {
    if (!initialData) {
      setFormData(INITIAL_FORM_DATA);
      setExistingDocuments([]);
      setSubcategories([]);
      setSelectedCountryCode("");
      setSelectedStateCode("");
      setStates([]);
      setCities([]);
      setShowPublishModal(false);
      setShowRejectReasonModal(false);
      setShowRejectConfirmModal(false);
      setRejectReason("");
      setDocumentPreview(null);
      reset({
        ...INITIAL_FORM_DATA,
        document: "",
      });
      return;
    }

    const nextFormData = mapTenderToFormData(initialData);
    const matchedCategory = categories.find(
      (item) => item.category === nextFormData.main_category,
    );
    const countryCode = getCountryCodeByName(nextFormData.tender_country);
    const stateList = countryCode ? State.getStatesOfCountry(countryCode) : [];
    const stateCode = getStateCodeByName(
      countryCode,
      nextFormData.tender_state,
    );
    const cityList =
      countryCode && stateCode
        ? City.getCitiesOfState(countryCode, stateCode)
        : [];

    const nextExistingDocuments = Array.isArray(
      initialData?.tender_documents_path,
    )
      ? initialData.tender_documents_path
      : [];

    setFormData(nextFormData);
    setExistingDocuments(nextExistingDocuments);
    setSubcategories(matchedCategory?.subcategories || []);
    setSelectedCountryCode(countryCode);
    setSelectedStateCode(stateCode);
    setStates(stateList);
    setCities(cityList);
    setFileNames([]);
    setShowPublishModal(false);
    setShowRejectReasonModal(false);
    setShowRejectConfirmModal(false);
    setRejectReason(initialData?.rejection_reason || "");
    const initialPreviewDocument = getFirstPreviewableExistingDocument(
      nextExistingDocuments,
    );

    if (initialPreviewDocument) {
      openExistingDocumentPreview(initialPreviewDocument);
    } else {
      setDocumentPreview(null);
    }
    reset({
      ...nextFormData,
      document: "",
    });
  }, [categories, initialData, reset]);

  useEffect(() => {
    return () => {
      if (documentPreview?.revokeOnCleanup && documentPreview?.url) {
        URL.revokeObjectURL(documentPreview.url);
      }
    };
  }, [documentPreview]);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  };

  const handleCategoryChange = (category) => {
    const selected = categories.find((item) => item.category === category);

    setSubcategories(selected?.subcategories || []);
    updateField("main_category", category);
    updateField("sub_category", "");
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(
      (country) => country.isoCode === countryCode,
    );

    setSelectedCountryCode(countryCode);
    setSelectedStateCode("");
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);

    updateField("tender_country", selectedCountry?.name || "");
    updateField("tender_state", "");
    updateField("tender_city", "");
    clearErrors(["tender_country", "tender_state"]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((state) => state.isoCode === stateCode);

    setSelectedStateCode(stateCode);
    setCities(City.getCitiesOfState(selectedCountryCode, stateCode));

    updateField("tender_state", selectedState?.name || "");
    updateField("tender_city", "");
    clearErrors("tender_state");
  };

  const handleCityChange = (e) => {
    updateField("tender_city", e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      document: files,
    }));
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
  };

  const handleSelectedDocumentDelete = (indexToRemove) => {
    const nextDocuments = selectedDocuments.filter(
      (_, index) => index !== indexToRemove,
    );
    const removedDocument = selectedDocuments[indexToRemove];

    setFormData((prev) => ({
      ...prev,
      document: nextDocuments,
    }));
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
  };

  const handleRequiredDocumentChange = (documentItem, isChecked) => {
    const currentDocuments = Array.isArray(formData.required_documents)
      ? formData.required_documents
      : [];

    const nextDocuments = isChecked
      ? [...currentDocuments, documentItem]
      : currentDocuments.filter((item) => item?.id !== documentItem.id);

    updateField("required_documents", nextDocuments);
  };

  const validation = {
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

  const handleFormSubmit = async (
    statusOverride = "",
    rejectionReasonOverride = "",
  ) => {
    setActiveSubmitAction(statusOverride || "draft");
    setIsLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "document") {
          return;
        }

        if (key === "required_documents") {
          payload.append(key, JSON.stringify(value ?? []));
          return;
        }

        payload.append(key, value ?? "");
      });

      payload.append("retained_documents", JSON.stringify(existingDocuments));

      if (statusOverride) {
        payload.append("status", statusOverride);
      } else {
        payload.append("status", "draft");
      }

      if (statusOverride === "rejected") {
        payload.append("rejection_reason", rejectionReasonOverride.trim());
      }

      selectedDocuments.forEach((file) => {
        payload.append("document", file);
      });

      const result = isEditMode
        ? await updateTenderById(tenderId, payload, initialData.teb_number)
        : await addTender(payload);

      if (result?.success) {
        const successMessage =
          statusOverride === "pendingForApproval"
            ? "Tender submitted for approval successfully"
            : statusOverride === "published"
              ? "Tender approved successfully"
              : statusOverride === "rejected"
                ? "Tender rejected successfully"
                : isEditMode
                  ? "Tender updated successfully"
                  : "Tender created successfully";

        showAlert(successMessage, 1);
        router.push(isAllow ? "/tender-approve" : "/tenders");
        router.refresh();
      } else {
        showAlert(
          result?.msg ||
            result?.error ||
            result?.message ||
            `Failed to ${isEditMode ? "update" : "create"} tender`,
          2,
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} tender:`,
        error,
      );
      showAlert(`Error ${isEditMode ? "updating" : "creating"} tender`, 2);
    } finally {
      setIsLoading(false);
      setActiveSubmitAction("");
    }
  };

  const handleDraftSubmit = async () => {
    await handleFormSubmit("draft");
  };
  const handleReadyForApprovalSubmit = handleSubmit(
    async () => {
      setReadyForApproval(false);
      await handleFormSubmit("pendingForApproval");
    },
    (formErrors) => {
      const firstError = Object.values(formErrors || {}).find(
        (errorItem) => Boolean(errorItem?.message),
      );

      showAlert(
        firstError?.message || "Please complete all required fields",
        2,
      );
    },
  );
  const handlePublishSubmit = handleSubmit(() => {
    setShowPublishModal(true);
  });
  const handlePublishConfirm = async () => {
    setShowPublishModal(false);
    await handleFormSubmit("published");
  };
  const handleRejectSubmit = handleSubmit(() => {
    setShowRejectReasonModal(true);
  });
  const handleRejectReasonContinue = () => {
    const rejectionReason = String(
      rejectReason || formData.rejection_reason || "",
    ).trim();

    if (!rejectionReason) {
      showAlert("Please enter rejection reason", 2);
      return;
    }

    updateField("rejection_reason", rejectionReason);
    setRejectReason(rejectionReason);
    setShowRejectReasonModal(false);
    setShowRejectConfirmModal(true);
  };
  const handleRejectConfirm = async () => {
    const rejectionReason = String(
      rejectReason || formData.rejection_reason || "",
    ).trim();

    if (!rejectionReason) {
      showAlert("Please enter rejection reason", 2);
      setShowRejectConfirmModal(false);
      setShowRejectReasonModal(true);
      return;
    }

    setShowRejectConfirmModal(false);
    await handleFormSubmit("rejected", rejectionReason);
  };

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
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Reference Number</label>
                    <div className={style.inputsWrap}>
                      <input
                        className={commonStyle.formControl}
                        type="text"
                        id="tender_number"
                        name="tender_number"
                        placeholder="Tender Reference Number"
                        value={formData.tender_number}
                        onChange={handleChange}
                      />
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
                        className={commonStyle.formControl}
                        name="tender_end_date"
                        {...validation.tender_end_date}
                        value={formData.tender_end_date}
                        onChange={handleChange}
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
                        className={commonStyle.formControl}
                        name="tender_start_date"
                        {...validation.tender_start_date}
                        value={formData.tender_start_date}
                        onChange={handleChange}
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
                        className={commonStyle.formControl}
                        name="tender_publishing_date"
                        {...validation.tender_publishing_date}
                        value={formData.tender_publishing_date}
                        onChange={handleChange}
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
                        className={commonStyle.formControl}
                        id="tender_title"
                        name="tender_title"
                        placeholder="Tender Title"
                        {...validation.tender_title}
                        value={formData.tender_title}
                        onChange={handleChange}
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
                        name="tender_description"
                        className={commonStyle.formControl}
                        placeholder="Tender Description"
                        {...validation.tender_description}
                        value={formData.tender_description}
                        onChange={handleChange}
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
                        className={commonStyle.formControl}
                        name="tender_purchaser_name"
                        placeholder="Tender Purchaser Name"
                        {...validation.tender_purchaser_name}
                        value={formData.tender_purchaser_name}
                        onChange={handleChange}
                      />
                      {errors.tender_purchaser_name && (
                        <span className={commonStyle.errorText}>
                          {errors.tender_purchaser_name.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Ministry Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="ministry_name"
                        className={commonStyle.formControl}
                        name="ministry_name"
                        placeholder="Ministry Name"
                        value={formData.ministry_name}
                        onChange={handleChange}
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
                        name="tender_purchaser_address"
                        placeholder="Tender Purchaser Address"
                        className={commonStyle.formControl}
                        {...validation.tender_purchaser_address}
                        value={formData.tender_purchaser_address}
                        onChange={handleChange}
                        rows="2"
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Website</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        name="tender_website"
                        className={commonStyle.formControl}
                        placeholder="Tender Website"
                        value={formData.tender_website}
                        onChange={handleChange}
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
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="form-control"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
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
                        value={selectedStateCode}
                        onChange={handleStateChange}
                        className="form-control"
                        disabled={!selectedCountryCode}
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
                        name="tender_city"
                        value={formData.tender_city}
                        onChange={handleCityChange}
                        className="form-control"
                        disabled={!selectedStateCode}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
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
                        name="main_category"
                        value={formData.main_category}
                        className={commonStyle.formControl}
                        onChange={(e) => handleCategoryChange(e.target.value)}
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
                        name="sub_category"
                        value={formData.sub_category}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender EMD</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        className={commonStyle.formControl}
                        name="tender_emd"
                        placeholder="Tender EMD"
                        value={formData.tender_emd}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>
                      Bidding Type<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_bidding_type"
                        className={commonStyle.formControl}
                        {...validation.tender_bidding_type}
                        value={formData.tender_bidding_type}
                        onChange={handleChange}
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
                        value={formData.tender_type}
                        className={commonStyle.formControl}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        className={commonStyle.formControl}
                        value={formData.tender_evaluation}
                        onChange={handleChange}
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
                        value={formData.tender_procurement_process}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Contact Person</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_contact_person"
                        name="tender_contact_person"
                        placeholder="Tender Contact Person"
                        className={commonStyle.formControl}
                        value={formData.tender_contact_person}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Tender Contract Period</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_contract_period"
                        name="tender_contract_period"
                        placeholder="Tender Contract Period"
                        className={commonStyle.formControl}
                        value={formData.tender_contract_period}
                        onChange={handleChange}
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Office Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_office_name"
                        name="tender_office_name"
                        className={commonStyle.formControl}
                        value={formData.tender_office_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}

                  {/* <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Organisation</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_organisation"
                        name="tender_organisation"
                        className={commonStyle.formControl}
                        placeholder="Department / Organization"
                        value={formData.tender_organisation}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}

                  <div className={style.couponRow + " " + "col-md-4"}>
                    <label>Department</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="department"
                        className={commonStyle.formControl}
                        name="department"
                        placeholder="Tender Office Name"
                        value={formData.department}
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                              (selectedItem) =>
                                selectedItem?.name === item.name,
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
                  {initialData && initialData.rejection_details.length > 0 && (
                    <div className={style.couponRow + " " + "col-md-12"}>
                      <label>Rejection Details</label>
                      <ul>
                        {initialData.rejection_details.map((item, index) => (
                          <li key={index} className="pb-3 mb-3 border-bottom">
                            <div className="">
                              <i class="bi bi-person-fill"></i> {item.username}{" "}
                              {formatDate(item.created_at, 6)}
                              <p className="mb-0">{item.reject_reason}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={style.couponRow + " " + "col-md-12 mb-1"}>
                    <label>
                      Upload Tender Document
                      {!isEditMode && <span className={style.astrike}>*</span>}
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...validation.document}
                        value={
                          selectedDocuments.length || existingDocuments.length
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
                    {existingDocuments.length > 0 && (
                      <ul style={{ marginBottom: "8px" }}>
                        {existingDocuments.map((doc, index) => (
                          <li
                            key={`${doc?.s3_path || doc?.title || "doc"}-${index}`}
                          >
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
                              {doc?.title || `Document ${index + 1}`}
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
                            </button>
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
                            </button>{" "}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      )}

                      {documentPreview.type === "application/pdf" && (
                        <iframe
                          src={documentPreview.url}
                          title={`Preview of ${documentPreview.name}`}
                          width="100%"
                          height="auto"
                          style={{
                            border: "1px solid #d8dee9",
                            height: "100vh",

                            // borderRadius: "8px",
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
            <div className={commonStyle.formBtnWrap}>
              {isAllow ? (
                <>
                  <button
                    type="button"
                    disabled={isLoading}
                    className={commonStyle.commonBtn}
                    onClick={handlePublishSubmit}
                  >
                    {isLoading && activeSubmitAction === "published"
                      ? "Saving..."
                      : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className={commonStyle.commonBtn}
                    onClick={handleRejectSubmit}
                  >
                    {isLoading && activeSubmitAction === "rejected"
                      ? "Saving..."
                      : "Reject"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleDraftSubmit}
                    className={commonStyle.commonBtn}
                  >
                    {isLoading && activeSubmitAction === "draft"
                      ? "Saving..."
                      : "Save as Draft"}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className={commonStyle.commonBtn}
                    onClick={() => setReadyForApproval(true)}
                  >
                    {isLoading && activeSubmitAction === "pendingForApproval"
                      ? "Saving..."
                      : "Submit For Approval"}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() =>
                  router.push(isAllow ? "/tender-approve" : "/tenders")
                }
                className={commonStyle.commonBtn + " " + commonStyle.stroke}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <CommonModal
        show={showPublishModal}
        handleClose={() => !isLoading && setShowPublishModal(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to publish this tender?
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
              onClick={handlePublishConfirm}
              disabled={isLoading}
            >
              {isLoading && activeSubmitAction === "published"
                ? "Saving..."
                : "YES"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setShowPublishModal(false)}
              disabled={isLoading}
            >
              NO
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={showRejectReasonModal}
        handleClose={() => !isLoading && setShowRejectReasonModal(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Add rejection reason for this tender.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason"
            style={{
              width: "100%",
              minHeight: "110px",
              border: "1px solid #d8dee9",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
          />
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
              onClick={handleRejectReasonContinue}
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setShowRejectReasonModal(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={showRejectConfirmModal}
        handleClose={() => !isLoading && setShowRejectConfirmModal(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to reject this tender?
          </p>
          <div
            style={{
              marginBottom: "12px",
              padding: "10px 12px",
              borderRadius: "6px",
              background: "#f5f7fb",
              color: "#4b5563",
              fontSize: "14px",
            }}
          >
            {rejectReason || formData.rejection_reason || "-"}
          </div>
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
              onClick={handleRejectConfirm}
              disabled={isLoading}
            >
              {isLoading && activeSubmitAction === "rejected"
                ? "Saving..."
                : "YES"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => {
                setShowRejectConfirmModal(false);
                setShowRejectReasonModal(true);
              }}
              disabled={isLoading}
            >
              NO
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={readyForApproval}
        handleClose={() => setReadyForApproval(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to submit this for approval?
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
              onClick={handleReadyForApprovalSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "YES"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setReadyForApproval(false)}
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
