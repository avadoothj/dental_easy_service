"use client";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import Link from "next/link";
import style from "@/css/isp/isp.module.scss";
import { useForm } from "react-hook-form";
import { getCityList, getDistrictList } from "@/controllers/common";
import messages from "@/utils/messages";
import { formatPrice, getConstant, formatDate } from "@/utils/utils";
import { AppContext } from "@/contextProvider";
import { editIspDetails, editSuperIsp } from "@/controllers/isp";
import { addIspValidation } from "@/utils/formValidation";
import SelectMultiSearch from "@/components/common/selectMultiSearch";
// import { partnerType } from "@/utils/masterData";

export default function DetailsView({ isp, stateList, handleResetPlanPage, user }) {
	const {
		register: register1,
		reset: reset1,
		handleSubmit: handleSubmit1,
		formState: { errors: errors1 },
	} = useForm();

	const {
		register: register2,
		reset: reset2,
		handleSubmit: handleSubmit2,
		formState: { errors: errors2 },
	} = useForm();

	const {
		register: register3,
		reset: reset3,
		handleSubmit: handleSubmit3,
		formState: { errors: errors3 },
	} = useForm();

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const textareaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

	const { showAlert } = useContext(AppContext);

	const defaultFormData = {
		oper_name: isp.entity_id,
		contact1: isp.contact1,
		email1: isp.email1,
		email2: isp.email2,
		address: isp.address,
		state_id: isp.state_id,
		district_id: isp.district_id,
		city_id: isp.city_id,

	};

	isp.display_partner_type = "---";

	// partnerType
	// 	.filter((x) => x.value == isp.partner_type)
	// 	.map((x) => {
	// 		isp.display_partner_type = x.label;
	// 	});

	const formValidation = {
		oper_name: register1("oper_name", addIspValidation.oper_name),
		critical_balance: register1("critical_balance", addIspValidation.critical_balance),
		contact1: register2("contact1", addIspValidation.contact1),
		email1: register2("email1", addIspValidation.email1),
		email2: register2("email2", addIspValidation.email2),
		address: register2("address", addIspValidation.address),
		finance_email1: register3("finance_email1", addIspValidation.finance_email1),
		finance_email2: register3("finance_email2", addIspValidation.finance_email2),
		business_email1: register3("business_email1", addIspValidation.business_email1),
		business_email2: register3("business_email2", addIspValidation.business_email2),
	};

	if (user.user_type == "internal") {
		formValidation.sap_code = register1("sap_code", addIspValidation.sap_code);
	}

	const [formData, setFormData] = useState(defaultFormData);
	const [state, setState] = useState("");
	const [districtList, setDistrictList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuperLoading, setSuperIsLoading] = useState(false);
	const [form1Update, setForm1Update] = useState(false);
	const [form2Update, setForm2Update] = useState(false);
	const [form3Update, setForm3Update] = useState(false);
	const [isOrgDetailsEditable, setIsOrgDetailsEditable] = useState(false);
	const [isContactDetailsEditable, setIsContactDetailsEditable] = useState(false);
	const [isSpocDetailsEditable, setIsSpocDetailsEditable] = useState(false);
	// const [partnerTypeList, setPartnerTypeList] = useState(partnerType);
	const [isSupIspEditable, setIsSupIspEditable] = useState(false);
	const [autoRenewOnoff, setAutoRenewOnoff] = useState(
		defaultFormData.auto_renewal == 1 ? true : false
	);
	const [superIsp, setSuperIsp] = useState(isp.super_isp_id);

	useEffect(() => {
		fetchDefaultLocations();
	}, []);

	useEffect(() => {
		if (typeof jQuery == "undefined") {
			const interval = setInterval(() => {
				if (typeof jQuery != "undefined") {
					clearInterval(interval);
					addRemoveClass();
				}
			}, 200);
		} else {
			addRemoveClass();
		}
	}, [isOrgDetailsEditable, isContactDetailsEditable, isSpocDetailsEditable]);

	const fetchDefaultLocations = async () => {
		try {
			await fetchDistrictList();
			await fetchCityList(true);
		} catch (error) {
			console.log("default location error", error);
		}
	};

	const toggleAutoRenew = () => {
		setAutoRenewOnoff(!autoRenewOnoff);
	};

	const addRemoveClass = () => {
		if (isOrgDetailsEditable || isContactDetailsEditable || isSpocDetailsEditable) {
			jQuery("#teamBtn").attr("disabled", true);
			jQuery("#operBtn").attr("disabled", true);
		} else {
			jQuery("#teamBtn").attr("disabled", false);
			jQuery("#operBtn").attr("disabled", false);
		}
	};

	const fetchDistrictList = async () => {
		setDistrictList([]);
		setFormData({ ...formData, district_id: "", city_id: "" });
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
		updateSelectedForm("state_id", state);
	}, [state]);

	useEffect(() => {
		updateSelectedForm("super_isp", superIsp);
	}, [superIsp]);

	useEffect(() => {
		fetchCityList();
	}, [formData.district_id]);

	const handleChangeSupIspEditable = () => {
		setIsSupIspEditable(!isSupIspEditable);
	};

	const handleSaveSupIsp = async () => {
		const payload = {
			oper_id: formData.oper_id,
			super_isp: formData.super_isp_id,
		};

		setSuperIsLoading(true);
		const response = await editSuperIsp(payload);
		setSuperIsLoading(false);

		if (response.success) {
			showAlert(messages.ISP_EDIT_SUCCESS, 1);
			handleResetPlanPage();
		} else {
			showAlert(response.msg);
		}
	};

	const handleChangeEditable = (type) => {
		if (type == "editOrganization") {
			setIsOrgDetailsEditable(!isOrgDetailsEditable);
		} else if (type === "cancelOrganization") {
			setFormData((prev) => ({
				...prev,
				oper_name: defaultFormData.oper_name,
				critical_balance: defaultFormData.critical_balance,
			}));
			reset1({
				oper_name: defaultFormData.oper_name,
				critical_balance: defaultFormData.critical_balance,
			});
			setIsOrgDetailsEditable(!isOrgDetailsEditable);
			setForm1Update(false);
		} else if (type == "editContactDetails") {
			setIsContactDetailsEditable(!isContactDetailsEditable);
		} else if (type === "cancelContactDetails") {
			setFormData((prev) => ({
				...prev,
				contact1: defaultFormData.contact1,
				email1: defaultFormData.email1,
				email2: defaultFormData.email2,
				address: defaultFormData.address,
				state_id: defaultFormData.state_id,
				district_id: defaultFormData.district_id,
				city_id: defaultFormData.city_id,
			}));
			reset2({
				contact1: defaultFormData.contact1,
				email1: defaultFormData.email1,
				email2: defaultFormData.email2,
				address: defaultFormData.address,
				state_id: defaultFormData.state_id,
				district_id: defaultFormData.district_id,
				city_id: defaultFormData.city_id,
			});
			setIsContactDetailsEditable(!isContactDetailsEditable);
			setForm2Update(false);
		} else if (type == "editSpocDetails") {
			setIsSpocDetailsEditable(!isSpocDetailsEditable);
		} else if (type === "cancelSpocDetails") {
			setFormData((prev) => ({
				...prev,
				finance_email1: defaultFormData.finance_email1,
				finance_email2: defaultFormData.finance_email2,
				business_email1: defaultFormData.business_email1,
				business_email2: defaultFormData.business_email2,
			}));
			reset3({
				finance_email1: defaultFormData.finance_email1,
				finance_email2: defaultFormData.finance_email2,
				business_email1: defaultFormData.business_email1,
				business_email2: defaultFormData.business_email2,
			});
			setIsSpocDetailsEditable(!isSpocDetailsEditable);
			setForm3Update(false);
		}
	};

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleFormSubmit1 = async () => {
		const payload = {
			oper_id: formData.oper_id,
			oper_name: formData.oper_name,
			critical_balance: formData.critical_balance,
		};

		if (user.user_type == "internal") {
			payload.sap_code = formData.sap_code;
			payload.partner_type = formData.partner_type;
			payload.api_version = formData.api_version;
		}

		setIsLoading(true);
		const response = await editIspDetails(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.ISP_EDIT_SUCCESS, 1);
			handleResetPlanPage();
		} else {
			showAlert(response.msg);
		}
	};

	const handleFormSubmit2 = async () => {
		const payload = {
			oper_id: formData.oper_id,
			contact1: formData.contact1,
			email1: formData.email1,
			email2: formData.email2 ?? "",
			address: formData.address,
			state_id: formData.state_id ?? "",
			district_id: formData.district_id,
			city_id: formData.city_id,
		};

		setIsLoading(true);
		const response = await editIspDetails(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.ISP_EDIT_SUCCESS, 1);
			handleResetPlanPage();
		} else {
			showAlert(response.msg);
		}
	};

	const handleFormSubmit3 = async () => {
		const payload = {
			oper_id: formData.oper_id,
			finance_email1: formData.finance_email1,
			finance_email2: formData.finance_email2,
			business_email1: formData.business_email1,
			business_email2: formData.business_email2,
		};

		setIsLoading(true);
		const response = await editIspDetails(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.ISP_EDIT_SUCCESS, 1);
			handleResetPlanPage();
		} else {
			showAlert(response.msg);
		}
	};

	return (
		<Accordion
			defaultActiveKey="0"
			className={style.subscriberAccordion}
		>
			<Accordion.Item
				eventKey="0"
				className={style.subscriberAccordionItem}
			>
				<Accordion.Header className={style.subscriberAccordionHeader}>
					Organization Details
				</Accordion.Header>

				<Accordion.Body className={style.subscriberAccordionBody}>
					<div className={style.Detailsinner}>
						{isOrgDetailsEditable ? (
							<form onSubmit={handleSubmit1(handleFormSubmit1)}>
								<div className={style.brdtopopdtl}>
									<div className={style.detlcoln}>
										<label>ISP Name</label>
										<div className={style.inptrel}>
											<input
												{...formValidation.oper_name}
												onChange={(e) => {
													formValidation.oper_name.onChange(e);
													updateSelectedForm("oper_name", e.target.value);
													setForm1Update(true);
												}}
												type="text"
												name="oper_name"
												id="oper_name"
												value={formData.oper_name}
												placeholder="Enter ISP Name"
												maxLength={inputMaxLength}
											/>
											{errors1?.oper_name && (
												<span className={style.logerror}>
													{errors1.oper_name?.message}
												</span>
											)}
										</div>
									</div>
								
								</div>
							
								<div className={style.editBtnWrap}>
									<div className={style.btnWrapper2}>
										<button
											type="button"
											className="commonBtn borderBtn"
											onClick={() =>
												handleChangeEditable("cancelOrganization")
											}
										>
											Cancel
										</button>
										<button
											type="submit"
											className="commonBtn dark"
											disabled={isLoading || !form1Update}
										>
											{isLoading ? getConstant("LOADING_TEXT") : "Save"}
										</button>
									</div>
								</div>
							</form>
						) : (
							<>
								<div className={style.noeditopdtl}>
									<div className={style.detailsRow}>
										<div className={style.brdtopopdtl}>
											<div className={style.detlcoln}>
												<label>ISP Name</label>
												<div className={style.inptrel}>
													{formData.oper_name}
												</div>
											</div>
											
										</div>
									</div>
									
								</div>

								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<div className={style.editWrap}>
										<Link
											onClick={() => handleChangeEditable("editOrganization")}
											href="#"
										>
											Edit Details
										</Link>
									</div>
								)}
							</>
						)}
					</div>
				</Accordion.Body>
			</Accordion.Item>

			<Accordion.Item
				eventKey="1"
				className={style.subscriberAccordionItem}
			>
				<Accordion.Header className={style.subscriberAccordionHeader}>
					Contact Details
				</Accordion.Header>
				<Accordion.Body className={style.subscriberAccordionBody}>
					<div className={style.Detailsinner}>
						{isContactDetailsEditable ? (
							<form onSubmit={handleSubmit2(handleFormSubmit2)}>
								<div className={style.brdtop}>
									<div className={style.detlcol}>
										<div className={style.tworowcol}>
											<label>Contact Number</label>
											<div className={style.inptrel}>
												<input
													{...formValidation.contact1}
													onChange={(e) => {
														formValidation.contact1.onChange(e);
														updateSelectedForm(
															"contact1",
															e.target.value
														);
														setForm2Update(true);
													}}
													type="text"
													name="contact1"
													id="contact1"
													value={formData.contact1}
													placeholder="Enter Mobile Number"
													maxLength={inputMaxLength}
												/>
												{errors2?.contact1 && (
													<span className={style.logerror}>
														{errors2.contact1?.message}
													</span>
												)}
											</div>
										</div>
									</div>
									<div className={style.detlcol}>
										<div className={style.tworowcol}>
											<label>Email ID</label>
											<div className={style.inptrel}>
												<input
													{...formValidation.email1}
													onChange={(e) => {
														formValidation.email1.onChange(e);
														updateSelectedForm(
															"email1",
															e.target.value
														);
														setForm2Update(true);
													}}
													type="text"
													name="email1"
													id="email1"
													value={formData.email1}
													placeholder="Primary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors2?.email1 && (
													<span className={style.logerror}>
														{errors2.email1?.message}
													</span>
												)}
											</div>
										</div>
										<div className={style.tworowcol}>
											<label></label>
											<div className={style.inptrel}>
												<input
													{...formValidation.email2}
													onChange={(e) => {
														formValidation.email2.onChange(e);
														updateSelectedForm(
															"email2",
															e.target.value
														);
														setForm2Update(true);
													}}
													type="text"
													name="email2"
													id="email2"
													value={formData.email2}
													placeholder="Secondary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors2?.email2 && (
													<span className={style.logerror}>
														{errors2.email2?.message}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className={style.isprow}>
									<div className={style.detailsRow}>
										<div className={style.formGroup}>
											<div className={style.detailCol2}>
												<label>Address</label>
												<div className={style.inputsWrap}>
													<textarea
														{...formValidation.address}
														onChange={(e) => {
															formValidation.address.onChange(e);
															updateSelectedForm(
																"address",
																e.target.value
															);
															setForm2Update(true);
														}}
														name="address"
														id="address"
														value={formData.address}
														placeholder="Add Address"
														maxLength={textareaMaxLength}
													/>
													{errors2?.address && (
														<span className={style.logerror}>
															{errors2.address?.message}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.colspan2}`}
											>
												<label>
													State<span>Optional</span>
												</label>
												<SelectMultiSearch
													defaultSelected={formData.state_id}
													data={stateList}
													id="state"
													placeholder="States"
													noOptionsText="No states found"
													callback={(data) => {
														setForm2Update(true);
														setState(data);
													}}
												/>
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
																parseInt(e.target.value)
															);
															setForm2Update(true);
														}}
													>
														<option value="0">Select</option>
														{districtList.map((x, i) => (
															<option
																key={i}
																value={x.id}
															>
																{x.name}
															</option>
														))}
													</select>
												</div>
											</div>
											<div className={style.detailCol2}>
												<label className={style.autoWidth}>
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
																parseInt(e.target.value)
															);
															setForm2Update(true);
														}}
													>
														<option value="0">Select</option>
														{cityList.map((x, i) => (
															<option
																key={i}
																value={x.id}
															>
																{x.name}
															</option>
														))}
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className={style.editBtnWrap}>
									<div className={style.btnWrapper2}>
										<button
											type="button"
											className="commonBtn borderBtn"
											onClick={() =>
												handleChangeEditable("cancelContactDetails")
											}
										>
											Cancel
										</button>
										<button
											type="submit"
											className="commonBtn dark"
											disabled={isLoading || !form2Update}
										>
											{isLoading ? getConstant("LOADING_TEXT") : "Save"}
										</button>
									</div>
								</div>
							</form>
						) : (
							<>
								<div className={style.noeditopdtl2}>
									<div className={style.detailsRow}>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Contact No</label>
												<div className={style.inputDetails}>
													{formData.contact1}
												</div>
											</div>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Email ID</label>
												<div
													className={`${style.inputDetails} ${style.multiEmail}`}
												>
													<div>{formData.email1}</div>
													<div>{formData.email2}</div>
												</div>
											</div>
										</div>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Address</label>
												<div className={style.inputDetails}>
													{formData.address}
												</div>
											</div>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>State</label>
												<div className={style.inputDetails}>
													{stateList?.list?.find(
														(state) => state.id == formData.state_id
													)?.name || "---"}
												</div>
											</div>
										</div>
									</div>
									<div className={style.detailsRow}>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Zone</label>
												<div className={style.inputDetails}>
													{formData.zone_name}
												</div>
											</div>
										</div>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>District</label>
												<div className={style.inputDetails}>
													{districtList.find(
														(district) =>
															district.id == formData.district_id
													)?.name || "---"}
												</div>
											</div>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>City</label>
												<div className={style.inputDetails}>
													{cityList.find(
														(city) => city.id == formData.city_id
													)?.name || "---"}
												</div>
											</div>
										</div>
									</div>
								</div>

								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<div className={style.editWrap}>
										<Link
											onClick={() =>
												handleChangeEditable("editContactDetails")
											}
											href="#"
										>
											Edit Details
										</Link>
									</div>
								)}
							</>
						)}
					</div>
				</Accordion.Body>
			</Accordion.Item>

			<Accordion.Item
				eventKey="2"
				className={style.subscriberAccordionItem}
			>
				<Accordion.Header className={style.subscriberAccordionHeader}>
					OTTPlay Internal SPOC
				</Accordion.Header>
				<Accordion.Body className={style.subscriberAccordionBody}>
					<div className={style.Detailsinner}>
						{isSpocDetailsEditable ? (
							<form onSubmit={handleSubmit3(handleFormSubmit3)}>
								<div className={style.brdtop}>
									<div className={style.detlcol}>
										<div className={style.tworowcol}>
											<label>Finance Team Email ID</label>
											<div className={style.inptrel}>
												<input
													{...formValidation.finance_email1}
													onChange={(e) => {
														formValidation.finance_email1.onChange(e);
														updateSelectedForm(
															"finance_email1",
															e.target.value
														);
														setForm3Update(true);
													}}
													type="text"
													name="finance_email1"
													id="finance_email1"
													value={formData.finance_email1}
													placeholder="Primary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors3?.finance_email1 && (
													<span className={style.logerror}>
														{errors3.finance_email1?.message}
													</span>
												)}
											</div>
										</div>
										<div className={style.tworowcol}>
											<label></label>
											<div className={style.inptrel}>
												<input
													{...formValidation.finance_email2}
													onChange={(e) => {
														formValidation.finance_email2.onChange(e);
														updateSelectedForm(
															"finance_email2",
															e.target.value
														);
														setForm3Update(true);
													}}
													type="text"
													name="finance_email2"
													id="finance_email2"
													value={formData.finance_email2}
													placeholder="Secondary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors3?.finance_email2 && (
													<span className={style.logerror}>
														{errors3.finance_email2?.message}
													</span>
												)}
											</div>
										</div>
									</div>
									<div className={style.detlcol}>
										<div className={style.tworowcol}>
											<label>Business Team Email ID</label>
											<div className={style.inptrel}>
												<input
													{...formValidation.business_email1}
													onChange={(e) => {
														formValidation.business_email1.onChange(e);
														updateSelectedForm(
															"business_email1",
															e.target.value
														);
														setForm3Update(true);
													}}
													type="text"
													name="business_email1"
													id="business_email1"
													value={formData.business_email1}
													placeholder="Primary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors3?.business_email1 && (
													<span className={style.logerror}>
														{errors3.business_email1?.message}
													</span>
												)}
											</div>
										</div>
										<div className={style.tworowcol}>
											<label></label>
											<div className={style.inptrel}>
												<input
													{...formValidation.business_email2}
													onChange={(e) => {
														formValidation.business_email2.onChange(e);
														updateSelectedForm(
															"business_email2",
															e.target.value
														);
														setForm3Update(true);
													}}
													type="text"
													name="business_email2"
													id="business_email2"
													value={formData.business_email2}
													placeholder="Secondary Email ID"
													maxLength={inputMaxLength}
												/>
												{errors3?.business_email2 && (
													<span className={style.logerror}>
														{errors3.business_email2?.message}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className={style.editBtnWrap}>
									<div className={style.btnWrapper2}>
										<button
											type="button"
											className="commonBtn borderBtn"
											onClick={() =>
												handleChangeEditable("cancelSpocDetails")
											}
										>
											Cancel
										</button>
										<button
											type="submit"
											className="commonBtn dark"
											disabled={isLoading || !form3Update}
										>
											{isLoading ? getConstant("LOADING_TEXT") : "Save"}
										</button>
									</div>
								</div>
							</form>
						) : (
							<>
								<div className={style.noeditopdtl3}>
									<div className={style.detailsRow}>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Finance Team Email ID</label>
												<div className={style.inputDetails}>
													{formData.finance_email1}
												</div>
											</div>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label></label>
												<div className={style.inputDetails}>
													{formData.finance_email2}
												</div>
											</div>
										</div>
										<div className={`${style.formGroup} ${style.twoCol}`}>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label>Business Team Email ID</label>
												<div className={style.inputDetails}>
													{formData.business_email1}
												</div>
											</div>
											<div
												className={`${style.detailCol2} ${style.AlignTop}`}
											>
												<label></label>
												<div className={style.inputDetails}>
													{formData.business_email2}
												</div>
											</div>
										</div>
									</div>
								</div>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<div className={style.editWrap}>
										<Link
											onClick={() => handleChangeEditable("editSpocDetails")}
											href="#"
										>
											Edit Details
										</Link>
									</div>
								)}
							</>
						)}
					</div>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}
