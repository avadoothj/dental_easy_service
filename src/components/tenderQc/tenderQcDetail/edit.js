"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppContext } from "@/contextProvider";
import style from "@/styles/coupon/coupon.module.scss";
import { Country, State, City } from "country-state-city";
import {
  convertDateToISO,
  formatDateOnly,
  formatIndianNumber,
} from "@/utils/utils";
import CommonModal from "@/components/common/commonModal";
import { disableTenderController } from "@/controllers/tenderQc";
import commonStyle from "@/css/common/common.module.scss";
import { generatePresignedUrl } from "@/utils/s3Update";
import CustomImage from "@/components/common/customImage";
import { downloadIcon2 } from "@/utils/imagesPicker";

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

export default function TenderQcEditForm({
  tenderQcDetails,
  tenderQcId,
  updateTenderQc,
  catData,
  financierList,
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
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [disableReason, setDisableReason] = useState("");
  const [isDisabling, setIsDisabling] = useState(false);
  const [isConform, setIsConform] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    tenderQcDetails?.tender_country || "",
  );
  const [selectedState, setSelectedState] = useState(
    tenderQcDetails?.tender_state || "",
  );
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories] = useState(catData || []);
  const [subcategories, setSubcategories] = useState([]);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [activeDocumentPath, setActiveDocumentPath] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const defaultFormData = {
    tender_city: tenderQcDetails?.tender_city || "",
    tender_state: tenderQcDetails?.tender_state || "",
    tender_country: tenderQcDetails?.tender_country || "",
    tender_financier: tenderQcDetails?.tender_financier || "",
    tender_organisation: tenderQcDetails?.tender_organisation || "",
    tender_purchaser_address: tenderQcDetails?.tender_purchaser_address || "",
    tender_end_date: tenderQcDetails?.tender_end_date || "",
    tender_emd: tenderQcDetails?.tender_emd || "",
    estimated_bid_value:
      formatIndianNumber(
        tenderQcDetails?.llm_extracted_data?.financial?.estimated_bid_value
          ?.amount,
      ) || "",
    main_category:
      tenderQcDetails?.llm_extracted_data?.basic_info?.main_category || "",
    sub_category:
      tenderQcDetails?.llm_extracted_data?.basic_info?.sub_category || "",
    tender_title:
      tenderQcDetails?.llm_extracted_data?.basic_info?.generated_title ||
      tenderQcDetails?.tender_title ||
      "",
    tender_description:
      tenderQcDetails?.llm_extracted_data?.basic_info?.summary ||
      tenderQcDetails?.tender_description ||
      "",
    tender_number: tenderQcDetails?.tender_number || "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const financierData = Array.isArray(financierList?.list)
    ? financierList.list
    : [];

  const openExistingDocumentPreview = async (documentItem) => {
    const previewType = getPreviewType(
      documentItem?.title || documentItem?.s3_path,
      documentItem?.type,
    );

    if (!documentItem?.s3_path || !previewType) {
      setDocumentPreview(null);
      setActiveDocumentPath("");
      return;
    }

    setIsPreviewLoading(true);

    try {
      const previewUrl = await generatePresignedUrl(documentItem.s3_path, true);

      if (!previewUrl) {
        setDocumentPreview(null);
        return;
      }

      setDocumentPreview({
        name: documentItem?.title || "Document",
        type: previewType,
        url: previewUrl,
      });

      setActiveDocumentPath(documentItem.s3_path);
    } catch (error) {
      console.error("Preview failed:", error);
      setDocumentPreview(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!catData || !tenderQcDetails) return;

    const mainCategory =
      tenderQcDetails?.llm_extracted_data?.basic_info?.main_category;

    const subCategory =
      tenderQcDetails?.llm_extracted_data?.basic_info?.sub_category;

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
  }, [catData, tenderQcDetails]);

  useEffect(() => {
    const initialPreviewDocument = getFirstPreviewableExistingDocument(
      tenderQcDetails?.tender_documents_path || [],
    );

    if (initialPreviewDocument) {
      openExistingDocumentPreview(initialPreviewDocument);
      return;
    }

    setDocumentPreview(null);
    setActiveDocumentPath("");
  }, [tenderQcDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "tender_end_date") {
      finalValue = convertDateToISO(value);
    }

    const updatedData = {
      ...formData,
      [name]: finalValue,
    };

    setFormData(updatedData);
    setValue(name, finalValue);
    setDataEdited(true);
  };

  const handleFormSubmit = async () => {
    if (!dataEdited) {
      showAlert("No changes made", 2);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        id: tenderQcId,
        tender_title: formData.tender_title,
        tender_description: formData.tender_description,
        tender_number: formData.tender_number,
        tender_financier: formData.tender_financier,
        tender_end_date: formData.tender_end_date,
        tender_organisation: formData.tender_organisation,
        tender_purchaser_address: formData.tender_purchaser_address,
        estimated_bid_value: formData.estimated_bid_value,
        tender_emd: formData.tender_emd,
        tender_country: formData.tender_country,
        tender_state: formData.tender_state,
        tender_city: formData.tender_city,
        main_category: formData.main_category,
        sub_category: formData.sub_category,
      };
      const result = await updateTenderQc(payload);

      if (result?.success) {
        showAlert("Tender QC data updated successfully", 1);
        router.push("/tender-qc");
        router.refresh();
      } else {
        showAlert(
          result?.error || result?.message || "Failed to update tender QC data",
          2,
        );
      }
    } catch (error) {
      console.error("Error updating tender QC:", error);
      showAlert("Error updating tender QC data", 2);
    } finally {
      setIsLoading(false);
    }
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

  const handleDownload = async (path, title, index) => {
    try {
      const url = await generatePresignedUrl(path);

      if (!url) {
        alert("File not available");
        return;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = title || `Document_${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
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
    if (!tenderQcDetails?.tender_country) return;

    const countryCode = getCountryCode(tenderQcDetails.tender_country);
    if (!countryCode) return;

    setSelectedCountry(countryCode);

    const stateList = State.getStatesOfCountry(countryCode);
    setStates(stateList);

    if (!tenderQcDetails?.tender_state) return;

    const state = stateList.find(
      (s) =>
        s.name.toLowerCase() === tenderQcDetails.tender_state.toLowerCase(),
    );

    if (!state) return;

    setSelectedState(state.isoCode);

    const cityList = City.getCitiesOfState(countryCode, state.isoCode);
    setCities(cityList);

    if (!tenderQcDetails?.tender_city) return;

    const city = cityList.find(
      (c) => c.name.toLowerCase() === tenderQcDetails.tender_city.toLowerCase(),
    );

    if (city) {
      setFormData((prev) => ({
        ...prev,
        tender_city: city.name,
      }));

      setValue("tender_city", city.name);
    }
  }, [tenderQcDetails, setValue]);
  const handleCloseModal = (forceClose = false) => {
    if (isDisabling && !forceClose) {
      return;
    }

    setDataEdited(false);
    setDisableReason("");
  };
  const handleDisable = async () => {
    if (!disableReason.trim()) {
      showAlert("Please enter disable reason", 2);
      return;
    }

    setShowDisablePopup(false);
    setIsConform(true);
  };

  const handleDisableTender = async () => {
    setIsDisabling(true);

    const result = await disableTenderController({
      id: tenderQcId,
      disableReason,
    });

    if (result.success) {
      showAlert("Tender disabled successfully", 1);
      setIsConform(false);
      router.push("/tender-qc");
      router.refresh();
    } else {
      showAlert(result?.message || "Failed", 2);
    }

    setIsDisabling(false);
  };

  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Number</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_number"
                        name="tender_number"
                        value={formData.tender_number}
                        onChange={handleInputChange}
                        placeholder="Enter tender number"
                        className={commonStyle.formControl}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender Financier</label>
                    <div className={style.inputsWrap}>
                      <select
                        name="tender_financier"
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
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Title<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_title"
                        name="tender_title"
                        {...register("tender_title", {
                          required: "Tender title is required",
                        })}
                        value={formData.tender_title}
                        onChange={handleInputChange}
                        placeholder="Enter tender title"
                        className={
                          errors.tender_title
                            ? style.error
                            : " " + commonStyle.formControl
                        }
                      />
                      {errors.tender_title && (
                        <span className={style.errorText}>
                          {errors.tender_title.message}
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
                        id="tender_end_date"
                        name="tender_end_date"
                        {...register("tender_end_date", {
                          required: "Tender Closing date is required",
                        })}
                        value={formatDateOnly(formData.tender_end_date)}
                        onChange={handleInputChange}
                        placeholder="Enter tender end date"
                        className={
                          errors.tender_end_date
                            ? style.error
                            : " " + commonStyle.formControl
                        }
                      />
                      {errors.tender_end_date && (
                        <span className={style.errorText}>
                          {errors.tender_end_date.message}
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
                        {...register("tender_description", {
                          required: "Tender Description required",
                        })}
                        value={formData.tender_description}
                        onChange={handleInputChange}
                        placeholder="Enter tender description"
                        className={
                          errors.tender_description
                            ? style.error
                            : " " + commonStyle.formControl
                        }
                      />
                      {errors.tender_description && (
                        <span className={style.errorText}>
                          {errors.tender_description.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Organisation
                      <span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_organisation"
                        name="tender_organisation"
                        {...register("tender_organisation", {
                          required: "Tender organisation is required",
                        })}
                        value={formData.tender_organisation}
                        onChange={handleInputChange}
                        placeholder="Enter tender organisation"
                        className={
                          errors.tender_organisation
                            ? style.error
                            : " " + commonStyle.formControl
                        }
                      />
                      {errors.tender_organisation && (
                        <span className={style.errorText}>
                          {errors.tender_organisation.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Estimated Cost</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="estimated_bid_value"
                        name="estimated_bid_value"
                        value={formData.estimated_bid_value}
                        onChange={handleInputChange}
                        className={commonStyle.formControl}
                        placeholder="Enter estimated bid value"
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-12"}>
                    <label>Tender Purchaser Address</label>
                    <div className={style.inputsWrap}>
                      <textarea
                        type="text"
                        id="tender_purchaser_address"
                        name="tender_purchaser_address"
                        value={formData.tender_purchaser_address}
                        onChange={handleInputChange}
                        placeholder="Enter tender purchaser address"
                        rows="2"
                        className={commonStyle.formControl}
                      />
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Tender EMD</label>
                    <div className={style.inputsWrap}>
                      <input
                        type="text"
                        id="tender_emd"
                        name="tender_emd"
                        value={formData.tender_emd}
                        className={commonStyle.formControl}
                        onChange={handleInputChange}
                        placeholder="Enter tender EMD"
                      />
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender Country<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...register("tender_country", {
                          required: "Tender country is required",
                        })}
                        value={formData.tender_country}
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
                        <span className={style.errorText}>
                          {errors.tender_country.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>
                      Tender State<span className={style.astrike}>*</span>
                    </label>
                    <div className={style.inputsWrap}>
                      <input
                        type="hidden"
                        {...register("tender_state", {
                          required: "Tender state is required",
                        })}
                        value={formData.tender_state}
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
                        <span className={style.errorText}>
                          {errors.tender_state.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
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

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Main Category</label>
                    <div className={style.inputsWrap}>
                      <select
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
                    </div>
                  </div>

                  <div className={style.couponRow + " " + "col-md-6"}>
                    <label>Sub Category</label>
                    <div className={style.inputsWrap}>
                      <select
                        value={formData.sub_category}
                        onChange={(e) => {
                          const val = e.target.value;

                          setFormData((prev) => ({
                            ...prev,
                            sub_category: val,
                          }));

                          setValue("sub_category", val);
                          setDataEdited(true);
                        }}
                        className={commonStyle.formControl}
                      >
                        <option value="">Select Sub Category</option>

                        {subcategories.map((sub, index) => (
                          <option key={index} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={style.couponRow + " " + "col-md-12"}>
                    <div
                      className={commonStyle.documentsWrapper}
                      // style={{
                      //   display: "grid",
                      //   gridTemplateColumns:
                      //     "minmax(280px, 340px) minmax(0, 1fr)",
                      //   gap: "20px",
                      //   alignItems: "start",
                      // }}
                    >
                      <div>
                        <h5>Tender Documents</h5>

                        {tenderQcDetails?.tender_documents_path?.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            {tenderQcDetails.tender_documents_path.map(
                              (doc, index) => (
                                <li
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    // justifyContent: "space-between",
                                    gap: "12px",
                                    fontSize: "14px",
                                  }}
                                >
                                  <span
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color:
                                        activeDocumentPath === doc.s3_path
                                          ? "#0f766e"
                                          : "#007bff",
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                      padding: 0,
                                      textAlign: "left",
                                      fontWeight:
                                        activeDocumentPath === doc.s3_path
                                          ? 600
                                          : 400,
                                    }}
                                    onClick={() =>
                                      openExistingDocumentPreview(doc)
                                    }
                                  >
                                    {doc.title?.slice(0,50) || `Document ${index + 1}`}
                                  </span>
                                  <span
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleDownload(
                                        doc.s3_path,
                                        doc.title,
                                        index,
                                      )
                                    }
                                  >
                                    <CustomImage
                                      alt="download"
                                      src={downloadIcon2}
                                      width="20"
                                      height="20"
                                    />
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p style={{ marginBottom: 0 }}>
                            No documents available.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={style.couponRow}
                  style={{ position: "sticky", top: "80px" }}
                >
                  <h5>Document Preview</h5>
                  <div className={style.inputsWrap}>
                    {isPreviewLoading ? (
                      <div
                        style={{
                          minHeight: "420px",
                          border: "1px solid #d8dee9",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          background: "#f8fafc",
                        }}
                      >
                        Loading preview...
                      </div>
                    ) : null}

                    {!isPreviewLoading &&
                    documentPreview?.type?.startsWith("image/") ? (
                      <img
                        src={documentPreview.url}
                        alt={documentPreview.name}
                        style={{
                          width: "100%",
                          maxHeight: "70vh",
                          objectFit: "contain",
                          border: "1px solid #d8dee9",
                          borderRadius: "8px",
                        }}
                      />
                    ) : null}

                    {!isPreviewLoading &&
                    documentPreview?.type === "application/pdf" ? (
                      <iframe
                        src={documentPreview.url}
                        title={`Preview of ${documentPreview.name}`}
                        width="100%"
                        height="600"
                        style={{
                          border: "1px solid #d8dee9",
                          borderRadius: "8px",
                        }}
                      />
                    ) : null}

                    {!isPreviewLoading && !documentPreview ? (
                      <div
                        style={{
                          minHeight: "420px",
                          border: "1px solid #d8dee9",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          background: "#f8fafc",
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        Preview is not available for this document.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className={commonStyle.formBtnWrap}>
              <button
                type="submit"
                disabled={isLoading || !dataEdited}
                className={commonStyle.commonBtn}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowDisablePopup(true)}
                className={commonStyle.commonBtn}
              >
                Mark as Disable
              </button>
              <button
                type="button"
                onClick={() => router.push("/tender-qc")}
                className={commonStyle.commonBtn + " " + commonStyle.stroke}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <CommonModal
        show={showDisablePopup}
        handleClose={handleCloseModal}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Add tender disable reason.
          </p>
          <textarea
            value={disableReason}
            onChange={(e) => setDisableReason(e.target.value)}
            placeholder="Enter comment"
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
              onClick={handleDisable}
              disabled={isDisabling}
            >
              {isDisabling ? "Disabling..." : "Submit"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setShowDisablePopup(false)}
              disabled={isDisabling}
            >
              Cancel
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal show={isConform} handleClose={false} centered={true}>
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to disable this tender? Once disabled, it will
            not appear in tender bharo website.
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
              onClick={handleDisableTender}
              disabled={isDisabling}
            >
              {isDisabling ? "Disabling..." : "Submit"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setIsConform(false)}
              disabled={isDisabling}
            >
              Cancel
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
