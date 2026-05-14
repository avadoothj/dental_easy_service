"use client";

import CustomDataTable from "@/components/common/customDatatable";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  getCategoriesWithSubcategories,
  getTenderQcData,
} from "@/controllers/tenderQc";
import Link from "next/link";
import { cleanTenderTitle, dataTrim, dateIOSConverter } from "@/utils/utils";
import { useForm } from "react-hook-form";
import style from "@/css/reports/ledger.module.scss";
import style1 from "@/styles/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";

import { City, Country, State } from "country-state-city";
import SelectMultiSearch from "../common/selectMultiSearch";
import CustomDatepicker from "@/common/customDatepicker";
import Accordion from "react-bootstrap/Accordion";
import { common } from "@mui/material/colors";

export default function TenderQcTable() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const [action, setAction] = useState("view");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [allCat, setAllCat] = useState([]);
  const [selectedMainCats, setSelectedMainCats] = useState([]);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      country: "",
      state: "",
      city: "",
      main_cat: "",
      sub_cat: "",
    },
  });

  useEffect(() => {
    getCategoriesWithSubcategories().then((catData) => {
      if (Array.isArray(catData)) setAllCat(catData);
    });
    if (childRef.current?.reloadData) {
      childRef.current.reloadData();
    }
  }, []);

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({ id: c.isoCode, label: c.name })),
    [],
  );

  const stateOptions = useMemo(() => {
    if (!selectedCountries.length) return [];

    return selectedCountries.flatMap((countryCode) => {
      const states = State.getStatesOfCountry(countryCode);

      return states.map((s) => ({
        id: `${countryCode}-${s.isoCode}`,
        label: `${s.name} (${countryCode})`,
        _rawStateCode: s.isoCode,
        _rawCountryCode: countryCode,
      }));
    });
  }, [selectedCountries]);

  const cityOptions = useMemo(() => {
    if (!selectedStates.length) return [];

    return selectedStates.flatMap((stateEntry) => {
      const [countryCode, stateCode] = stateEntry.split("-");

      if (!countryCode || !stateCode) {
        console.warn("Could not parse Country or State code from:", stateEntry);
        return [];
      }

      return City.getCitiesOfState(countryCode, stateCode).map((c) => ({
        id: `${countryCode}-${stateCode}-${c.name}`,
        label: c.name,
        _rawCityName: c.name,
      }));
    });
  }, [selectedStates]);

  const mainOptions = useMemo(
    () => allCat.map((item) => ({ id: item.category, label: item.category })),
    [allCat],
  );

  const subOptions = useMemo(() => {
    if (!selectedMainCats.length) return [];
    let subs = [];
    selectedMainCats.forEach((cat) => {
      const found = allCat.find((c) => c.category === cat);
      if (found?.subcategories) subs = [...subs, ...found.subcategories];
    });
    return [...new Set(subs)].map((s) => ({ id: s, label: s }));
  }, [selectedMainCats, allCat]);

  const handleFormSubmit = async () => {
    const selectedCountriesNames = countryOptions
      .filter((option) => selectedCountries.includes(option.id))
      .map((option) => option.label)
      .join(", ");

    const selectedStatesNames = stateOptions
      .filter((option) => selectedStates.includes(option.id))
      .map((option) => option.label.split(" (")[0])
      .join(", ");

    const selectedCitiesNames = cityOptions
      .filter((option) => selectedCities.includes(option.id))
      .map((option) => option._rawCityName)
      .join(", ");

    const selectedMainCatNames = selectedMainCats.map((m) => m).join(", ");

    const selectedSubCatNames = selectedSubCats.map((s) => s).join(", ");

    const payload = {
      country: selectedCountriesNames,
      state: selectedStatesNames,
      city: selectedCitiesNames,
      main_category: selectedMainCatNames,
      sub_category: selectedSubCatNames,
      tender_start_date: startDate,
      tender_end_date: closeDate,
      tender_publishing_date: publishDate,
      action: action,
    };

    if (action === "view") {
      childRef.current?.reloadData(payload);
    } else {
      setIsLoading(true);
      try {
        await getTenderQcData(payload);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
  };

  const selectStyle = {
    "&": { width: "80%" },
    "@media (max-width:600px)": { width: "100%" },
  };

  const handleSelectedCountry = (list) => {
    const val = list || [];
    setSelectedCountries(val);
    setSelectedStates([]);
    setSelectedCities([]);
    setValue("country", val.map((c) => c.label).join(","));
    setValue("state", "");
    setValue("city", "");
  };

  const handleSelectedState = (list) => {
    const val = list || [];
    setSelectedStates(val);
    setSelectedCities([]);
    setValue("state", val.map((s) => s.label).join(","));
    setValue("city", "");
  };

  const handleSelectedCity = (list) => {
    const val = list || [];
    setSelectedCities(val);
    setValue("city", val.map((c) => c.id).join(","));
  };

  const handleSelectedMainCat = (list) => {
    const val = list || [];
    setSelectedMainCats(val);
    setSelectedSubCats([]);
    setValue("main_cat", val.map((m) => m.id).join(","));
    setValue("sub_cat", "");
  };

  const handleSelectedSubCat = (list) => {
    const val = list || [];
    setSelectedSubCats(val);
    setValue("sub_cat", val.map((s) => s.id).join(","));
  };

  const startDateChange = (date) => {
    setStartDate(date);
  };

  const closeDateChange = (date) => {
    setCloseDate(date);
  };

  const publishDateChange = (date) => {
    setPublishDate(date);
  };

  const columns = [
    "SL NO",
    "Teb Number",
    "Title",
    "Country",
    "State",
    "City",
    "Main Category",
    "Sub Category",
    "Publish Date",
    "Start Date",
    "Closing Date",
    "Source URL",
  ];
  const columnFieldMap = {
    City: "tender_city",
    Country: "tender_country",
    "Closing Date": "tender_end_date",
    Title: "tender_title",
  };

  const handleReset = () => {
    setSelectedCountries([]);
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedMainCats([]);
    setSelectedSubCats([]);

    setStartDate(null);
    setCloseDate(null);
    setPublishDate(null);

    setValue("country", "");
    setValue("state", "");
    setValue("city", "");
    setValue("main_cat", "");
    setValue("sub_cat", "");

    setResetKey((prev) => prev + 1);

    childRef.current?.reloadData({});
  };
  return (
    <>
      <div></div>
      <Accordion className="accordionWrap">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advance Filters</Accordion.Header>
          <Accordion.Body>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className={style.addmember}>
                {/* <div className={`${style.memtoppanel} ledgercal`}> */}
                {/* <div className={style.sechead}>Enter Filters</div> */}
                <div className="row">
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Country</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <SelectMultiSearch
                        key={resetKey}
                        data={countryOptions}
                        id="country"
                        limitTags={1}
                        showAllOption={false}
                        multiple={true}
                        showLabels={false}
                        showCheckboxes={true}
                        placeholder="Select Country"
                        value={selectedCountries}
                        callback={handleSelectedCountry}
                        renderTags={true}
                        style={selectStyle}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>State</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <SelectMultiSearch
                        key={resetKey}
                        data={stateOptions}
                        id="state"
                        limitTags={1}
                        showAllOption={false}
                        multiple={true}
                        showLabels={false}
                        showCheckboxes={true}
                        placeholder="Select State"
                        value={selectedStates}
                        callback={handleSelectedState}
                        renderTags={true}
                        style={selectStyle}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>City</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <SelectMultiSearch
                        key={resetKey}
                        data={cityOptions}
                        id="city"
                        limitTags={1}
                        showAllOption={false}
                        multiple={true}
                        showLabels={false}
                        showCheckboxes={true}
                        placeholder="Select City"
                        value={selectedCities}
                        callback={handleSelectedCity}
                        renderTags={true}
                        style={selectStyle}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Main Category</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <SelectMultiSearch
                        key={resetKey}
                        data={mainOptions}
                        id="main_cat"
                        limitTags={1}
                        showAllOption={false}
                        multiple={true}
                        showLabels={false}
                        showCheckboxes={true}
                        placeholder="Select  Main Category"
                        value={selectedCities}
                        callback={handleSelectedMainCat}
                        renderTags={true}
                        style={selectStyle}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Sub Category</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <SelectMultiSearch
                        key={resetKey}
                        data={subOptions}
                        id="sub_cat"
                        limitTags={1}
                        showAllOption={false}
                        multiple={true}
                        showLabels={false}
                        showCheckboxes={true}
                        placeholder="Select Sub Category"
                        value={selectedCities}
                        callback={handleSelectedSubCat}
                        renderTags={true}
                        style={selectStyle}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Publish Date</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <CustomDatepicker
                        value={publishDate}
                        callback={publishDateChange}
                        // maxDate={todaysDate}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Start Date</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <CustomDatepicker
                        value={startDate}
                        callback={startDateChange}
                        // maxDate={todaysDate}
                        // defaultValues={null}
                      />
                    </div>
                  </div>
                  <div className={style1.couponRow + " " + "col-md-4 mb-3"}>
                    <label>Close Date</label>
                    <div
                      className={
                        style1.inputsWrap + " " + "inputsWrap inputsWidth w-100"
                      }
                    >
                      <CustomDatepicker
                        value={closeDate}
                        callback={closeDateChange}
                        // maxDate={todaysDate}
                      />
                    </div>
                  </div>
                </div>
                {/* </div> */}

                <div className={commonStyle.formBtnWrap}>
                  <button
                    type="submit"
                    // className="commonBtn borderBtn"
                    className={commonStyle.commonBtn}
                    disabled={isLoading}
                    onClick={() => setAction("view")}
                  >
                    View Results
                  </button>
                  <button
                    type="submit"
                    // className="commonBtn borderBtn"
                    className={commonStyle.commonBtn + " " + commonStyle.stroke}
                    disabled={isLoading}
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <br />
      <CustomDataTable
        apiCall={getTenderQcData}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        ref={childRef}
        columnFieldMap={columnFieldMap}
      >
        {list.map((item, index) => {
          return (
            <tr key={item._id || index}>
              <td>{srNo + index}</td>
              <td>
                <Link href={`/tender-qc/${item._id}`}>
                  {item.teb_number || "-"}
                </Link>
              </td>
              <td>
                {dataTrim(
                  cleanTenderTitle(
                    item?.llm_extracted_data?.basic_info?.generated_title ||
                      item?.tender_title,
                  ),
                ) || "-"}
              </td>
              <td>{item.tender_country || "-"}</td>
              <td>{item.tender_state || "-"}</td>
              <td>{item.tender_city || "-"}</td>
              <td>
                {dataTrim(
                  item?.llm_extracted_data?.basic_info?.main_category,
                ) || "-"}
              </td>
              <td>
                {dataTrim(item?.llm_extracted_data?.basic_info?.sub_category) ||
                  "-"}
              </td>
              <td>{dateIOSConverter(item?.tender_publishing_date) || "-"}</td>
              <td>{dateIOSConverter(item?.tender_start_date) || "-"}</td>
              <td>{dateIOSConverter(item?.tender_end_date) || "-"}</td>
              {item.source_id && (
                <td>
                  <Link
                    href={item?.source_id || "-"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    view
                  </Link>
                </td>
              )}
            </tr>
          );
        })}
      </CustomDataTable>
    </>
  );
}
