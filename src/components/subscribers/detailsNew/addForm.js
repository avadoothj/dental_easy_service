"use client";
import React, { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "@/css/subscribers/subscribers.module.scss";
import { AppContext } from "@/contextProvider";
import {
  addSubscriberMobileValidation,
  addSubscriberEmailValidation,
  addSubscriberAdminValidation,
} from "@/utils/formValidation";
import CommonModal from "@/common/commonModal";
import CustomImage from "@/common/customImage";
import { getConstant } from "@/utils/utils";
import { editIcon, lockIcon } from "@/utils/imagesPicker";
import { addNewSubscriber } from "@/controllers/subscribers";
import messages from "@/utils/messages";
import { getCityList, getDistrictList } from "@/controllers/common";
import SelectMultiSearch from "@/components/common/selectMultiSearch";
import { getIspList } from "@/controllers/partners";
// import { getOperatorListByIsp } from "@/controllers/reports";

export default function AddSubscriberForm({ user, stateList }) {
  const filteredState = stateList.find((state) => state.id == user.state_id);

  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { showAlert } = useContext(AppContext);

  let tempActivationType = "mobile";
  if (user.user_type != "internal") {
    tempActivationType = user.activation_type;
  }

  const defaultFormData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    mobile: "",
    email: "",
    address: "",
    state: filteredState.id,
    city: "",
    district: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState({});

  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [dataEdited, setDataEdited] = useState(false);

  const [ispList, setIspList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);
  const [ispId, setIspId] = useState("");
  const [operatorId, setOperatorId] = useState("");

  const [ispName, setIspName] = useState("");
  const [operatorName, setOperatorName] = useState("");

  const [activationType, setActivationType] = useState(tempActivationType);
  const IspList = async () => {
    const list = await getIspList();
    setIspList(list);
  };

  const operatorsList = async () => {
    const list = await getOperatorListByIsp(ispId);
    setOperatorList(list);
  };

  useEffect(() => {
    let tempValidation = {};

    if (user.user_type == "internal") {
      tempValidation = { ...addSubscriberAdminValidation };
    }

    if (activationType == "mobile") {
      tempValidation = { ...tempValidation, ...addSubscriberMobileValidation };
    } else if (activationType == "email") {
      tempValidation = { ...tempValidation, ...addSubscriberEmailValidation };
    }

    setFormValidation({
      ispId: unregister("ispId", tempValidation?.isp_id),
      operatorId: unregister("operatorId", tempValidation?.operator_id),
      first_name: unregister("first_name", tempValidation.first_name),
      last_name: unregister("last_name", tempValidation.last_name),
      middle_name: unregister("middle_name", tempValidation.middle_name),
      mobile: unregister("mobile", tempValidation.mobile),
      email: unregister("email", tempValidation.email),
      address: unregister("address", tempValidation.address),
      reference_id: unregister("reference_id", tempValidation.reference_id),
    });

    setTimeout(() => {
      setFormValidation({
        ispId: register("ispId", tempValidation?.isp_id),
        operatorId: register("operatorId", tempValidation?.operator_id),
        first_name: register("first_name", tempValidation.first_name),
        last_name: register("last_name", tempValidation.last_name),
        middle_name: register("middle_name", tempValidation.middle_name),
        mobile: register("mobile", tempValidation.mobile),
        email: register("email", tempValidation.email),
        address: register("address", tempValidation.address),
        reference_id: register("reference_id", tempValidation.reference_id),
      });

      if (dataEdited) {
        setValue("ispId", ispId, { shouldValidate: true });
      }
    }, 100);
  }, [activationType]);

  useEffect(() => {
    if (user.user_type == "internal") {
      IspList();
    }
  }, []);

  useEffect(() => {
    if (ispId) {
      operatorsList();
      setDataEdited(true);

      setActivationType(
        ispList.filter((x) => x.id == ispId)[0].activation_type,
      );
      setFormData({ ...formData, ispId: ispId });
      setIspName(ispList.filter((x) => x.id == ispId)[0].label);
      setValue("ispId", ispId, {
        shouldValidate: true,
      });
    } else if (ispId == null) {
      setValue("ispId", "", {
        shouldValidate: true,
      });
    }
  }, [ispId]);

  useEffect(() => {
    if (operatorId) {
      setFormData({ ...formData, operatorId: operatorId });
      setOperatorName(operatorList.filter((x) => x.id == operatorId)[0].label);
      setValue("operatorId", operatorId, {
        shouldValidate: true,
      });
    } else if (operatorId === null) {
      setValue("operatorId", "", {
        shouldValidate: true,
      });
    }
  }, [operatorId]);

  useEffect(() => {
    document.body.className += " hamburgerHide";
    return () => {
      document.body.className = document.body.className.replace(
        "hamburgerHide",
        "",
      );
    };
  }, []);

  const fetchDistrictList = async () => {
    setDistrictList([]);
    setFormData({ ...formData, district: "", city: "" });
    if (!formData.state) return;
    const payload = {
      state_id: formData.state,
    };
    const districtList = await getDistrictList(payload);
    setDistrictList(districtList);
  };

  const fetchCityList = async () => {
    setCityList([]);
    setFormData({ ...formData, city: "" });
    if (!formData.state || !formData.district) return;
    const payload = {
      state_id: formData.state,
      district_id: formData.district,
    };
    const cityList = await getCityList(payload);
    setCityList(cityList);
  };

  useEffect(() => {
    fetchDistrictList();
  }, [formData.state]);

  useEffect(() => {
    fetchCityList();
  }, [formData.district]);

  const updateSelectedForm = (key, value) => {
    let temp = { ...formData };
    temp[key] = value;
    setFormData(temp);
  };

  const togglePreviewModal = () => {
    if (!isLoading) {
      setShowPreviewModal(!showPreviewModal);
    }
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const checkedFormData = {
      ...formData,
      state: formData.state || 16,
      district: formData.district || 3,
      city: formData.city || 3,
    };

    const response = await addNewSubscriber(checkedFormData);
    setIsLoading(false);

    if (response.success) {
      showAlert(messages.SUBSCRIBER_CREATE_SUCCESS, 1);
      router.push("/subscribers/details/" + response.sub_id);
    } else {
      showAlert(response.msg);
    }
  };
  const inputNameMaxLength = getConstant("MAXLENGTH_NAME");
  const inputMaxLength = getConstant("INPUT_MAXLENGTH");
  const textAreaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

  const handleError = (error) => {
    if (
      errors.first_name ||
      errors.last_name ||
      errors.middle_name ||
      errors.email ||
      errors.mobile ||
      errors.ispId ||
      errors.operatorId
    ) {
      if (
        jQuery("#primaryDetails").children().children().hasClass("collapsed")
      ) {
        jQuery("#primaryDetails").children().children().trigger("click");
      }
    } else if (
      errors.mobile ||
      errors.address ||
      errors.email ||
      errors.reference_id
    ) {
      if (
        jQuery("#optionalDetails").children().children().hasClass("collapsed")
      ) {
        jQuery("#optionalDetails").children().children().trigger("click");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(togglePreviewModal, handleError)}>
        <Accordion defaultActiveKey="0" className={style.subscriberAccordion}>
          <Accordion.Item
            eventKey="0"
            id="primaryDetails"
            className={style.subscriberAccordionItem}
          >
            <Accordion.Header className={style.subscriberAccordionHeader}>
              Primary Details
            </Accordion.Header>
            <Accordion.Body className={style.subscriberAccordionBody}>
              <div className={style.Detailsinner}>
                <div
                  className={
                    user.user_type == "internal"
                      ? `${style.adminDetailsRow}`
                      : `${style.detailsRow} ${style.fourColRow}`
                  }
                >
                  {user.user_type == "internal" && (
                    <>
                      <div className={style.detailCol}>
                        <label>ISP</label>
                        <div className={style.inputsWrap}>
                          <SelectMultiSearch
                            data={ispList}
                            id="operId"
                            placeholder="Select isp"
                            noOptionsText="No isp found"
                            callback={setIspId}
                          />
                          {errors?.ispId && (
                            <span className={style.logerror1}>
                              {errors.ispId?.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={style.detailCol}>
                        <label>Operator</label>
                        <div className={style.inputsWrap}>
                          <SelectMultiSearch
                            data={operatorList}
                            id="operId"
                            placeholder="Select operator"
                            noOptionsText="No operator found"
                            callback={setOperatorId}
                          />
                          {errors?.operatorId && (
                            <span className={style.logerror1}>
                              {errors.operatorId?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className={style.detailCol}>
                    <label>First Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        {...formValidation.first_name}
                        onChange={(e) => {
                          formValidation.first_name.onChange(e);
                          updateSelectedForm("first_name", e.target.value);
                          setDataEdited(true);
                        }}
                        value={formData.first_name}
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="Enter First Name"
                        maxLength={inputNameMaxLength}
                      />
                      {errors?.first_name && (
                        <span className={style.logerror1}>
                          {errors.first_name?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.detailCol}>
                    <label>Middle Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        {...formValidation.middle_name}
                        onChange={(e) => {
                          formValidation.middle_name.onChange(e);
                          updateSelectedForm("middle_name", e.target.value);
                        }}
                        value={formData.middle_name}
                        type="text"
                        name="middle_name"
                        id="middle_name"
                        placeholder="Enter Middle Name"
                        maxLength={inputNameMaxLength}
                      />
                      {errors?.middle_name && (
                        <span className={style.logerror1}>
                          {errors.middle_name?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={style.detailCol}>
                    <label>Last Name</label>
                    <div className={style.inputsWrap}>
                      <input
                        {...formValidation.last_name}
                        onChange={(e) => {
                          formValidation.last_name.onChange(e);
                          updateSelectedForm("last_name", e.target.value);
                          setDataEdited(true);
                        }}
                        value={formData.last_name}
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Enter Last Name"
                        maxLength={inputNameMaxLength}
                      />
                      {errors?.last_name && (
                        <span className={style.logerror1}>
                          {errors.last_name?.message}
                        </span>
                      )}
                    </div>
                  </div>
                  {activationType == "mobile" ? (
                    <div className={style.detailCol}>
                      <label>Contact Number</label>
                      <div className={style.inputsWrap}>
                        <input
                          {...formValidation.mobile}
                          onChange={(e) => {
                            formValidation.mobile.onChange(e);
                            updateSelectedForm("mobile", e.target.value);
                            setDataEdited(true);
                          }}
                          value={formData.mobile}
                          type="text"
                          name="mobile"
                          id="mobile"
                          placeholder="Enter Contact Number"
                          maxLength="10"
                        />
                        {errors?.mobile && (
                          <span className={style.logerror1}>
                            {errors.mobile?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={style.detailCol}>
                      <label>Email ID</label>
                      <div className={style.inputsWrap}>
                        <input
                          {...formValidation.email}
                          onChange={(e) => {
                            formValidation.email.onChange(e);
                            updateSelectedForm("email", e.target.value);
                            setDataEdited(true);
                          }}
                          value={formData.email}
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Enter Email ID"
                          maxLength={inputMaxLength}
                        />
                        {errors?.email && (
                          <span className={style.logerror1}>
                            {errors.email?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item
            eventKey="1"
            id="optionalDetails"
            className={style.subscriberAccordionItem}
          >
            <Accordion.Header className={style.subscriberAccordionHeader}>
              Optional Details
            </Accordion.Header>
            <Accordion.Body className={style.subscriberAccordionBody}>
              <div className={style.Detailsinner}>
                <div className={style.detailsRow}>
                  <div className={style.formGroup}>
                    {activationType == "mobile" ? (
                      <div className={style.detailCol2}>
                        <label>Email ID</label>
                        <div className={style.inputsWrap}>
                          <input
                            {...formValidation.email}
                            onChange={(e) => {
                              formValidation.email.onChange(e);
                              updateSelectedForm("email", e.target.value);
                            }}
                            value={formData.email}
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter Email ID"
                            maxLength={inputMaxLength}
                          />
                          {errors?.email && (
                            <span className={style.logerror}>
                              {errors.email?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={style.detailCol2}>
                        <label>Contact Number</label>
                        <div className={style.inputsWrap}>
                          <input
                            {...formValidation.mobile}
                            onChange={(e) => {
                              formValidation.mobile.onChange(e);
                              updateSelectedForm("mobile", e.target.value);
                            }}
                            value={formData.mobile}
                            type="text"
                            name="mobile"
                            id="mobile"
                            placeholder="Enter Contact Number"
                            maxLength="10"
                          />
                          {errors?.mobile && (
                            <span className={style.logerror}>
                              {errors.mobile?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className={style.detailCol2}>
                      <label>
                        Address<span>Optional</span>
                      </label>
                      <div className={style.inputsWrap}>
                        <textarea
                          {...formValidation.address}
                          onChange={(e) => {
                            formValidation.address.onChange(e);
                            updateSelectedForm("address", e.target.value);
                          }}
                          value={formData.address}
                          name="address"
                          id="address"
                          placeholder="Enter Address"
                          maxLength={textAreaMaxLength}
                        />
                        {errors?.address && (
                          <span className={style.logerror}>
                            {errors.address?.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`${style.formGroup} ${style.twoCol}`}>
                    <div className={`${style.detailCol2} ${style.fullCol}`}>
                      <label>Partner Reference ID</label>
                      <div className={style.inputsWrap}>
                        <input
                          {...formValidation.reference_id}
                          onChange={(e) => {
                            formValidation.reference_id.onChange(e);
                            updateSelectedForm("reference_id", e.target.value);
                          }}
                          value={formData.reference_id}
                          type="text"
                          name="reference_id"
                          id="reference_id"
                          placeholder="Enter Partner Reference ID"
                          maxLength={getConstant("PARTNER_ID_MAX_LENGTH")}
                        />
                        {errors?.reference_id && (
                          <span className={style.logerror}>
                            {errors.reference_id?.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`${style.detailCol2} ${style.fullCol}`}>
                      <label>
                        State<span>Optional</span>
                      </label>
                      <div className={style.customselect}>
                        <select
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={(e) => {
                            updateSelectedForm(
                              "state",
                              parseInt(e.target.value),
                            );
                          }}
                          disabled={true}
                        >
                          <option value={0} disabled="disabled">
                            Select
                          </option>
                          {stateList.map((x, i) => (
                            <option key={i} value={x.id}>
                              {x.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={style.detailCol2}>
                      <label>
                        District<span>Optional</span>
                      </label>
                      <div className={style.customselect}>
                        <select
                          name="district"
                          id="district"
                          value={formData.district}
                          onChange={(e) => {
                            updateSelectedForm(
                              "district",
                              parseInt(e.target.value),
                            );
                          }}
                        >
                          <option value={0}>Select</option>
                          {districtList.map((x, i) => (
                            <option key={i} value={x.id}>
                              {x.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={style.detailCol2}>
                      <label>
                        City<span>Optional</span>
                      </label>
                      <div className={style.customselect}>
                        <select
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={(e) => {
                            updateSelectedForm(
                              "city",
                              parseInt(e.target.value),
                            );
                          }}
                        >
                          <option value={0}>Select</option>
                          {cityList.map((x, i) => (
                            <option key={i} value={x.id}>
                              {x.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className={style.btnWrapper}>
          <button className="commonBtn dark" disabled={!dataEdited}>
            Save
          </button>
        </div>
      </form>

      <CommonModal
        show={showPreviewModal}
        className="setpricemodel"
        bodyClassName="setpricepad"
        animation={false}
      >
        <>
          <div className="setsubheader">
            <span>Preview Subscriber Details</span>
            <span className="closesetsub" onClick={togglePreviewModal}></span>
          </div>
          <div className={style.previewsubscriberModalWrap}>
            <div className={style.primdtltxt}>
              Primary Details
              <CustomImage alt="lock" src={lockIcon} width="17" height="17" />
            </div>
            <div className={style.previewcol}>
              {user.user_type == "internal" && (
                <>
                  <div className={style.prevrowcol}>
                    <p className={style.collef}>ISP Name</p>
                    <p className={style.colref}>
                      <span>{ispName}</span>
                    </p>
                  </div>

                  <div className={style.prevrowcol}>
                    <p className={style.collef}>Operator Name</p>
                    <p className={style.colref}>
                      <span>{operatorName}</span>
                    </p>
                  </div>
                </>
              )}
              <div className={style.prevrowcol}>
                <p className={style.collef}>First Name</p>
                <p className={style.colref}>
                  <span>{formData.first_name}</span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>Middle Name</p>
                <p className={style.colref}>
                  <span>
                    {formData.middle_name ? formData.middle_name : "---"}
                  </span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>Last Name</p>
                <p className={style.colref}>
                  <span>{formData.last_name}</span>
                </p>
              </div>
              {activationType == "mobile" ? (
                <div className={style.prevrowcol}>
                  <p className={style.collef}>Contact No</p>
                  <p className={style.colref}>
                    <span>{formData.mobile}</span>
                  </p>
                </div>
              ) : (
                <div className={style.prevrowcol}>
                  <p className={style.collef}>Email ID</p>
                  <p className={style.colref}>
                    <span>{formData.email}</span>
                  </p>
                </div>
              )}
            </div>
            <div className={style.primdtltxt}>
              Optional Details
              <CustomImage alt="edit" src={editIcon} width="17" height="17" />
            </div>
            <div className={style.previewcol}>
              {activationType == "mobile" ? (
                <div className={style.prevrowcol}>
                  <p className={style.collef}>Email ID</p>
                  <p className={style.colref}>
                    <span>{formData.email ? formData.email : "---"}</span>
                  </p>
                </div>
              ) : (
                <div className={style.prevrowcol}>
                  <p className={style.collef}>Contact No</p>
                  <p className={style.colref}>
                    <span>{formData.mobile ? formData.mobile : "---"}</span>
                  </p>
                </div>
              )}
              <div className={style.prevrowcol}>
                <p className={style.collef}>Address</p>
                <p className={style.colref}>
                  <span>{formData.address ? formData.address : "---"}</span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>
                  Partner
                  <br />
                  Reference ID
                </p>
                <p className={style.colref}>
                  <span>
                    {formData.reference_id ? formData.reference_id : "---"}
                  </span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>State</p>
                <p className={style.colref}>
                  <span>
                    {stateList.find((state) => state.id == formData.state)
                      ?.name || "---"}
                  </span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>District</p>
                <p className={style.colref}>
                  <span>
                    {districtList.find(
                      (district) => district.id == formData.district,
                    )?.name || "---"}
                  </span>
                </p>
              </div>
              <div className={style.prevrowcol}>
                <p className={style.collef}>City</p>
                <p className={style.colref}>
                  <span>
                    {cityList.find((city) => city.id == formData.city)?.name ||
                      "---"}
                  </span>
                </p>
              </div>
            </div>
            <div className={style.pnote}>
              Primary Details Once Saved Cannot Be Edited. Please Verify Before
              Saving.
            </div>
          </div>
          <div className="setsubfooter">
            <button
              type="button"
              className="backbutton"
              onClick={togglePreviewModal}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="button"
              className="savebutton"
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
            </button>
          </div>
        </>
      </CommonModal>
    </>
  );
}
