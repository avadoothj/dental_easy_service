"use client";
import { Accordion } from "react-bootstrap";
import style from "@/css/subscribers/subscribers.module.scss";
import CustomImage from "@/common/customImage";
import { editIcon, lockIcon } from "@/utils/imagesPicker";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCityList, getDistrictList } from "@/controllers/common";
import { editSubscriber } from "@/controllers/subscribers";
import messages from "@/utils/messages";
import { getConstant } from "@/utils/utils";
import { AppContext } from "@/contextProvider";
import { editSubscriberValidation } from "@/utils/formValidation";

export default function DetailsView({ user, subscriber }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { showAlert } = useContext(AppContext);

  useEffect(() => {
    fetchDefaultLocations();
  }, []);

  const defaultFormData = {
    id: subscriber.id,
    name: subscriber.name,
    mobile: subscriber.phone,
    email: subscriber.email,
  };

  const formValidation = {
    address: register("address", editSubscriberValidation.address),
    partner_ref_id: register(
      "partner_ref_id",
      editSubscriberValidation.reference_id,
    ),
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formUpdate, setFormUpdate] = useState(false);
  const [activationType, setActivationType] = useState(
    subscriber.activation_type,
  );

  // useEffect(() => {
  // 	// if (user.user_type == "internal") {
  // 	setActivationType(subscriber.activation_type);
  // 	// }
  // }, []);

  const fetchDefaultLocations = async () => {
    try {
      await fetchDistrictList(true);
      await fetchCityList(true);
    } catch (error) {
      console.log("default location errorr", error);
    }
  };

  const fetchDistrictList = async (prefill) => {
    setDistrictList([]);
    setFormData({
      ...formData,
      district_id: prefill ? formData.district_id : "",
    });
    if (!formData.state_id) return;
    const payload = {
      state_id: formData.state_id,
    };
    const districtList = await getDistrictList(payload);
    setDistrictList(districtList);
    return districtList;
  };

  const fetchCityList = async (prefill) => {
    setCityList([]);
    setFormData({ ...formData, city_id: prefill ? formData.city_id : "" });
    if (!formData.state_id || !formData.district_id) return;
    const payload = {
      state_id: formData.state_id,
      district_id: formData.district_id,
    };

    const cityList = await getCityList(payload);
    setCityList(cityList);
    return cityList;
  };

  useEffect(() => {
    fetchDistrictList();
  }, [formData.state_id]);

  useEffect(() => {
    fetchCityList();
  }, [formData.district_id]);

  const handleChangeEditable = (type) => {
    if (type === "cancel") {
      setFormData(defaultFormData);
    }
    setIsEditable((prev) => !prev);
  };

  const updateSelectedForm = (key, value) => {
    let temp = { ...formData };
    temp[key] = value;
    setFormData(temp);
    setFormUpdate(true);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const checkedFormData = {
      ...formData,
      state_id: formData.state_id || 16,
      district_id: formData.district_id || 3,
      city_id: formData.city_id || 3,
    };
    const response = await editSubscriber(checkedFormData);
    setIsLoading(false);
    if (response.success) {
      showAlert(messages.SUBSCRIBER_EDIT_SUCCESS, 1);
      setIsEditable(false);
    } else {
      showAlert(response.msg);
    }
  };

  const textAreaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

  return (
    <Accordion defaultActiveKey="0" className={style.subscriberAccordion}>
      <Accordion.Item eventKey="0" className={style.subscriberAccordionItem}>
        <Accordion.Header className={style.subscriberAccordionHeader}>
          Primary Details
          <CustomImage alt="lock" src={lockIcon} width="17" height="17" />
        </Accordion.Header>
        <Accordion.Body className={style.subscriberAccordionBody}>
          <div className={style.Detailsinner}>
            <div
              className={
                user.user_type == "internal"
                  ? `${style.adminDetailsRow2}`
                  : `${style.detailsRow}`
              }
            >
              <div className={`${style.detailCol} ${style.AlignCenter}`}>
                <label>Subscriber Name</label>
                <div className={style.inputDetails}>{formData.name}</div>
              </div>
              {/* <div className={`${style.detailCol} ${style.AlignCenter}`}>
                <label>Subscriber Code</label>
                <div className={style.inputDetails}>{formData.sub_code}</div>
              </div> */}

              <div className={`${style.detailCol} ${style.AlignCenter}`}>
                <label>Contact Number</label>
                <div className={style.inputDetails}>
                  {formData.mobile ? formData.mobile : "---"}
                </div>
              </div>

              <div className={`${style.detailCol} ${style.AlignCenter}`}>
                <label>Email ID</label>
                <div className={style.inputDetails}>{formData.email}</div>
              </div>

              {/* {user.user_type == "internal" && (
                <>
                  <div className={`${style.detailCol} ${style.AlignCenter}`}>
                    <label>ISP</label>
                    <div className={style.inputDetails}>
                      {subscriber.isp_name}
                    </div>
                  </div>
                  <div className={`${style.detailCol} ${style.AlignCenter}`}>
                    <label>Operator</label>
                    <div className={style.inputDetails}>
                      {subscriber.oper_name}
                    </div>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>

      {/* <Accordion.Item eventKey="1" className={style.subscriberAccordionItem}>
        <Accordion.Header className={style.subscriberAccordionHeader}>
          Optional Details
          <CustomImage alt="edit" src={editIcon} width="17" height="17" />
        </Accordion.Header>
        <Accordion.Body className={style.subscriberAccordionBody}>
          <div className={style.Detailsinner}>
            {isEditable ? (
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={style.detailsRow}>
                  <div className={style.formGroup}>
                    {activationType == "mobile" ? (
                      <div className={style.detailCol2}>
                        <label>Email ID</label>
                        <div className={style.inputDetails}>
                          {formData.email ? formData.email : "---"}
                        </div>
                      </div>
                    ) : (
                      <div className={`${style.detailCol2} ${style.AlignTop}`}>
                        <label>Contact Number</label>
                        <div className={style.inputDetails}>
                          {formData.mobile ? formData.mobile : "---"}
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
                          {...formValidation.partner_ref_id}
                          onChange={(e) => {
                            formValidation.partner_ref_id.onChange(e);
                            updateSelectedForm(
                              "partner_ref_id",
                              e.target.value,
                            );
                          }}
                          value={formData.partner_ref_id}
                          name="partner_ref_id"
                          id="partner_ref_id"
                          placeholder="Enter partner Reference ID"
                          maxLength={getConstant("PARTNER_ID_MAX_LENGTH")}
                        />
                        {errors?.partner_ref_id && (
                          <span className={style.logerror}>
                            {errors.partner_ref_id?.message}
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
                          value={formData.state_id}
                          onChange={(e) => {
                            updateSelectedForm(
                              "state_id",
                              parseInt(e.target.value),
                            );
                          }}
                          disabled={true}
                        >
                          <option value={0} disabled="disabled">
                            Select
                          </option>
                          {/* {stateList.map((x, i) => (
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
                          value={formData.district_id}
                          onChange={(e) => {
                            updateSelectedForm(
                              "district_id",
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
                          value={formData.city_id}
                          onChange={(e) => {
                            updateSelectedForm(
                              "city_id",
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
                <div className={style.editBtnWrap}>
                  <a href="#"></a>
                  <div className={style.btnWrapper2}>
                    <button
                      type="button"
                      className="commonBtn borderBtn"
                      onClick={() => handleChangeEditable("cancel")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="commonBtn dark"
                      disabled={isLoading || !formUpdate}
                    >
                      {isLoading ? getConstant("LOADING_TEXT") : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className={style.optionalDetailsRow}>
                  {activationType == "mobile" ? (
                    <div className={style.detailCol}>
                      <label>Email ID</label>
                      <div className={style.inputDetails}>
                        {formData.email ? formData.email : "---"}
                      </div>
                    </div>
                  ) : (
                    <div className={style.detailCol}>
                      <label>Contact Number</label>
                      <div className={style.inputDetails}>
                        {formData.mobile ? formData.mobile : "---"}
                      </div>
                    </div>
                  )}

                  <div className={style.detailCol}>
                    <label>Address</label>
                    <div className={`${style.inputDetails} ${style.wordBreak}`}>
                      {formData.address ? formData.address : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>Partner Reference ID</label>
                    <div className={style.inputDetails}>
                      {formData.partner_ref_id
                        ? formData.partner_ref_id
                        : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>State</label>
                    <div className={style.inputDetails}>
                      {/* {stateList.find((state) => state.id == formData.state_id)
                        ?.name || "---"} 
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>District</label>
                    <div className={style.inputDetails}>
                      {districtList.find(
                        (district) => district.id == formData.district_id,
                      )?.name || "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>City</label>
                    <div className={style.inputDetails}>
                      {cityList.find((city) => city.id == formData.city_id)
                        ?.name || "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>UDF 1</label>
                    <div className={style.inputDetails}>
                      {subscriber.udf_1 ? subscriber.udf_1 : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>UDF 2</label>
                    <div className={style.inputDetails}>
                      {subscriber.udf_2 ? subscriber.udf_2 : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>UDF 3</label>
                    <div className={style.inputDetails}>
                      {subscriber.udf_3 ? subscriber.udf_3 : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>Zone</label>
                    <div className={style.inputDetails}>
                      {subscriber.partner_zone
                        ? subscriber.partner_zone
                        : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>Service No</label>
                    <div className={style.inputDetails}>
                      {subscriber.partner_service_no
                        ? subscriber.partner_service_no
                        : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>State Code</label>
                    <div className={style.inputDetails}>
                      {subscriber.partner_state_code
                        ? subscriber.partner_state_code
                        : "---"}
                    </div>
                  </div>
                  <div className={style.detailCol}>
                    <label>Circle</label>
                    <div className={style.inputDetails}>
                      {subscriber.partner_circle
                        ? subscriber.partner_circle
                        : "---"}
                    </div>
                  </div>
                </div>
                <div className={style.editBtnWrap}>
                  <a onClick={() => handleChangeEditable("edit")} href="#">
                    Edit Details
                  </a>
                </div>
              </>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item> */}
    </Accordion>
  );
}
