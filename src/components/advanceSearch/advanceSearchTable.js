"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { City, Country, State } from "country-state-city";
import CustomDataTable from "@/components/common/customDatatable";
import { AppContext } from "@/contextProvider";
import commonStyle from "@/css/common/common.module.scss";
import style from "@/styles/coupon/coupon.module.scss";
import {
  advanceOpenSearchData,
  advanceInsertTender,
  getAdvanceSearchData,
} from "@/controllers/advanceSearch";
import { cleanTenderTitle, dataTrim, formatDateOnly } from "@/utils/utils";
import CommonModal from "../common/commonModal";

const INITIAL_VALUES = {
  tender_number: "",
  tender_title: "",
  tender_description: "",
  document: "",
  tender_country: "",
  tender_state: "",
  tender_city: "",
  tender_bidding_type: "NCB",
  tender_purchaser_name: "",
  tender_financier: "Self Financier",
  tender_end_date: "",
  tender_start_date: "",
  tender_purchaser_address: "",
  tender_email_id: "",
  tender_website: "",
  tender_value: "",
  tender_emd: "",
  main_category: "",
  sub_category: "",
  tender_category: "",
  tender_contract_type: "Tender Notice",
  document: [],
};

export default function AdvanceSearchTable({ financierList, categories = [] }) {
  const childRef = useRef();
  const { showAlert } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { ...INITIAL_VALUES, document: "" },
  });
  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const [tableMode, setTableMode] = useState("");
  const [activeAction, setActiveAction] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [pendingReloadPayload, setPendingReloadPayload] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const financierData = Array.isArray(financierList?.list)
    ? financierList.list
    : [];

  const selectedDocuments = Array.isArray(formData.document)
    ? formData.document
    : [];

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => {
    if (!selectedCountryCode) {
      return [];
    }

    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  const cities = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) {
      return [];
    }

    return City.getCitiesOfState(selectedCountryCode, selectedStateCode);
  }, [selectedCountryCode, selectedStateCode]);

  const validation = {
    tender_title: register("tender_title", {
      required: "Tender title is required",
    }),

    tender_description: register("tender_description", {
      required: "Summary is required",
    }),

    tender_country: register("tender_country", {
      required: "Country is required",
    }),

    tender_bidding_type: register("tender_bidding_type", {
      required: "Bidding type is required",
    }),

    tender_purchaser_name: register("tender_purchaser_name", {
      required: "Purchaser name is required",
    }),

    tender_end_date: register("tender_end_date", {
      required: "Closing date is required",
    }),

    tender_start_date: register("tender_start_date", {
      required: "Start date is required",
    }),

    tender_category: register("tender_category", {
      required: "Tender category is required",
    }),

    tender_contract_type: register("tender_contract_type", {
      required: "Contract type is required",
    }),

    tender_number: register("tender_number"),
    document: register("document"),
    tender_state: register("tender_state"),
    tender_city: register("tender_city"),
    tender_financier: register("tender_financier"),
    tender_purchaser_address: register("tender_purchaser_address"),
    tender_email_id: register("tender_email_id"),
    tender_website: register("tender_website"),
    tender_value: register("tender_value"),
    tender_emd: register("tender_emd"),
    main_category: register("main_category"),
    sub_category: register("sub_category"),
  };

  const columns = [
    "SL NO",

    "Tender Number",
    "Title",
    "Summary",
    "Organisation",
    "Country",
    "State",
    "City",
    "Bidding Type",
    "Financier",
    "Start Date",
    "Closing Date",
  ];

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const selectedState = states.find((state) => state.isoCode === stateCode);

    setSelectedStateCode(stateCode);

    updateField("tender_state", selectedState?.name || "");
    updateField("tender_city", "");
    clearErrors("tender_state");
  };

  useEffect(() => {
    setTableMode("saved");
    setPendingReloadPayload({});
  }, []);

  useEffect(() => {
    if (!tableMode || pendingReloadPayload === null || !childRef.current) {
      return;
    }

    childRef.current.reloadData(pendingReloadPayload);
    setPendingReloadPayload(null);
  }, [tableMode, pendingReloadPayload]);

  const handleSave = async () => {
    const hasSearchValue = Object.entries(formData).some(([key, value]) => {
      if (key === "document") {
        return Boolean(value?.length);
      }

      return String(value ?? "").trim() !== "";
    });

    if (!hasSearchValue) {
      showAlert?.("Please enter at least one value.", 2);
      return;
    }

    setActiveAction("search");
    setTableMode("search");
    setPendingReloadPayload(formData);
  };

  const handleFormSubmit = async (formData) => {
    setActiveAction("save");

    setIsLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "document") return;
        payload.append(key, value ?? "");
      });
      const selectedFile = formData.document?.[0];
      if (selectedFile) {
        payload.append("document", fileNames?.[0]);
      }

      const result = await advanceInsertTender(payload);

      if (result?.success) {
        showAlert?.("Advance search tender saved successfully", 1);
        setTableMode("saved");
        setPendingReloadPayload({});
        handleReset();

        childRef.current?.reloadData({});
      } else {
        showAlert?.(
          result?.msg ||
            result?.error ||
            "Failed to save advance search tender",
          2,
        );
      }
    } catch (error) {
      console.error("Advance search save error:", error);
      showAlert?.("Failed to save advance search tender", 2);
    } finally {
      setIsLoading(false);
      setActiveAction("");
    }
  };
  const handleReset = () => {
    reset({ ...INITIAL_VALUES, document: "" });
    setFormData({ ...INITIAL_VALUES, document: [] });
    setSelectedCountryCode("");
    setSelectedStateCode("");
    setSubcategories([]);
    setResults([]);
    setSrNo(1);
    setFileNames([]);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const getRowValue = (item, ...keys) => {
    for (const key of keys) {
      if (
        item?.[key] !== undefined &&
        item?.[key] !== null &&
        item?.[key] !== ""
      ) {
        return item[key];
      }
    }

    return "";
  };

  const tableApiCall =
    tableMode === "saved" ? getAdvanceSearchData : advanceOpenSearchData;
  const [popupData, setPopupData] = useState(null);
  const [modal, setModal] = useState(false);
  const getPopupData = (data) => {
    setPopupData(data);
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      document: files,
    }));
    setFileNames(files.map((file) => file));
    setValue("document", files.length ? "selected" : "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (files.length > 0) {
      clearErrors("document");
    }
  };

  const handleCategoryChange = (category) => {
    const selected = categories.find((item) => item.category === category);

    setSubcategories(selected?.subcategories || []);
    updateField("main_category", category);
    updateField("sub_category", "");
  };

  const contractType = [
    "Tender Notice",
    "Expression of Interest",
    "Contract Award",
    "Procurement Plan",
  ];

  return (
    <>
      <div className={style.assignCoupon}>
        <div className={style.inner}>
          <div className={style.assignCouponForm}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="row">
                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>Tender notice number</label>
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
                    {errors.tender_number && (
                      <span className={commonStyle.errorText}>
                        {errors.tender_number.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Country <span className={style.astrike}>*</span>
                  </label>
                  <div className={style.inputsWrap}>
                    <Controller
                      name="tender_country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <select
                          className="form-control"
                          value={selectedCountryCode}
                          onChange={(e) => {
                            const countryCode = e.target.value;
                            const selectedCountry = countries.find(
                              (c) => c.isoCode === countryCode,
                            );

                            setSelectedCountryCode(countryCode);
                            setSelectedStateCode("");

                            field.onChange(selectedCountry?.name || "");

                            clearErrors("tender_country");
                          }}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />

                    {errors.tender_country && (
                      <span className={commonStyle.errorText}>
                        {errors.tender_country.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>State</label>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>City</label>
                  <div className={style.inputsWrap}>
                    <Controller
                      name="tender_city"
                      control={control}
                      render={({ field }) => (
                        <select
                          className="form-control"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          disabled={!selectedStateCode}
                        >
                          <option value="">Select City</option>

                          {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Tender Title <span className={style.astrike}>*</span>
                  </label>
                  <div className={style.inputsWrap}>
                    <textarea
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Summary <span className={style.astrike}>*</span>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Start Date <span className={style.astrike}>*</span>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Closing Date <span className={style.astrike}>*</span>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Tender Purchaser Name{" "}
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>Tender Purchaser Address</label>
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
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-3"}>
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

                <div className={style.couponRow + " " + "col-md-3"}>
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

                <div className={style.couponRow + " " + "col-md-3"}>
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

                <div className={style.couponRow + " " + "col-md-3"}>
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

                <div className={style.couponRow + " " + "col-md-3"}>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Tender Category <span className={style.astrike}>*</span>
                  </label>
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
                    {errors.tender_category && (
                      <span className={commonStyle.errorText}>
                        {errors.tender_category.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-6"}>
                  <label>Main Category</label>
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
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-6"}>
                  <label>Sub Category</label>
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
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Tender Bidding Type <span className={style.astrike}>*</span>
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

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>
                    Contract Type <span className={style.astrike}>*</span>
                  </label>
                  <div className={style.inputsWrap}>
                    <select
                      name="tender_contract_type"
                      className={commonStyle.formControl}
                      value={formData.tender_contract_type}
                      onChange={handleChange}
                    >
                      {contractType.map((v, i) => (
                        <option key={i + 1} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    {errors.tender_contract_type && (
                      <span className={commonStyle.errorText}>
                        {errors.tender_contract_type.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>Financier</label>
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
                  </div>
                </div>
                <div className={style.couponRow + " " + "col-md-3"}>
                  <label>Document</label>
                  <div className={style.inputsWrap}>
                    <input
                      type="hidden"
                      {...validation.document}
                      value={selectedDocuments}
                      readOnly
                    />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className={commonStyle.formControl}
                    />
                  </div>
                </div>
              </div>

              <div className={commonStyle.formBtnWrap}>
                <button
                  type="button"
                  className={commonStyle.commonBtn}
                  disabled={isLoading}
                  onClick={handleSubmit(handleSave)}
                >
                  {isLoading && activeAction === "search"
                    ? "Searching..."
                    : "Search"}
                </button>
                <button
                  type="submit"
                  className={commonStyle.commonBtn}
                  disabled={isLoading}
                >
                  {isLoading && activeAction === "save" ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className={commonStyle.commonBtn + " " + commonStyle.stroke}
                  disabled={isLoading}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
      {tableMode && (
        <CustomDataTable
          apiCall={tableApiCall}
          setData={setResults}
          setSrNo={setSrNo}
          setIsParentLoading={setIsLoading}
          columns={columns}
          placeholderText="Search by tender number, TEB number, title, summary, organisation"
          ref={childRef}
        >
          {results.map((item, index) => (
            <tr
              onClick={() => getPopupData(item)}
              key={item._id || index}
              style={{ cursor: "pointer" }}
            >
              <td
                style={{
                  textAlign: "center",
                  color: "#2563eb",
                  cursor: "pointer",
                }}
              >
                {srNo + index}
              </td>
              {/* <td>{getRowValue(item, "teb_number")}</td> */}
              <td>{dataTrim(getRowValue(item, "tender_number"))}</td>
              <td>
                {dataTrim(
                  cleanTenderTitle(
                    item?.llm_extracted_data?.basic_info?.generated_title ||
                      getRowValue(item, "tender_title", "title"),
                  ),
                )}
              </td>
              <td>
                {dataTrim(
                  cleanTenderTitle(
                    item?.llm_extracted_data?.basic_info?.summary ||
                      getRowValue(item, "tender_description", "summary"),
                  ),
                )}
              </td>
              <td>
                {dataTrim(
                  getRowValue(
                    item,
                    "tender_purchaser_name",
                    "tender_organisation",
                  ),
                )}
              </td>
              <td>{getRowValue(item, "tender_country", "country")}</td>
              <td>{getRowValue(item, "tender_state", "state")}</td>
              <td>{getRowValue(item, "tender_city", "city")}</td>
              <td>
                {getRowValue(
                  item,
                  "tender_bidding_type",
                  "tender_type",
                  "bidding_type",
                )}
              </td>
              <td>
                {dataTrim(getRowValue(item, "tender_financier", "financier"))}
              </td>
              <td>
                {formatDateOnly(
                  getRowValue(item, "tender_end_date", "closing_date"),
                )}
              </td>
            </tr>
          ))}
        </CustomDataTable>
      )}
      {modal && (
        <CommonModal
          show={modal}
          handleClose={() => setModal(false)}
          centered={true}
        >
          <div style={{ padding: "8px" }}>
            <p
              style={{
                marginBottom: "12px",
                color: "#4b5563",
                fontSize: "14px",
              }}
            >
              {popupData?.tender_number}
            </p>
            <p
              style={{
                marginBottom: "12px",
                color: "#4b5563",
                fontSize: "14px",
              }}
            >
              <strong>Tender Title:</strong>{" "}
              {cleanTenderTitle(
                popupData?.llm_extracted_data?.basic_info?.generated_title ||
                  getRowValue(popupData, "tender_title", "title"),
              )}
            </p>
            <p
              style={{
                marginBottom: "12px",
                color: "#4b5563",
                fontSize: "14px",
              }}
            >
              <strong>Tender Description:</strong>{" "}
              {cleanTenderTitle(
                popupData?.llm_extracted_data?.basic_info?.summary ||
                  getRowValue(popupData, "tender_description"),
              )}
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
                className={commonStyle.commonBtn + " " + commonStyle.stroke}
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </CommonModal>
      )}
    </>
  );
}
