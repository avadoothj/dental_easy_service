"use client";
import React, { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "@/css/isp/isp.module.scss";
import { AppContext } from "@/contextProvider";
import { addIspValidation } from "@/utils/formValidation";
import CommonModal from "@/common/commonModal";
import { getConstant, formatPrice } from "@/utils/utils";
import messages from "@/utils/messages";
import { getCityList, getDistrictList } from "@/controllers/common";
import { addStackHolder } from "@/controllers/isp";
import SelectMultiSearch from "@/common/selectMultiSearch";
import { partnerType } from "@/utils/masterData";

export default function AddIspForm({ stateList, category, superIspList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const router = useRouter();
	// const { showAlert } = useContext(AppContext);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const textareaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

	const defaultFormData = {
		oper_name: "",
		contact1: "",
		email1: "",
		email2: "",
		address: "",
		state_id: "",
		district_id: "",
		city_id: "",
	};

	const formValidation = {
		oper_name: register("oper_name", addIspValidation.oper_name),
	};

	formValidation.contact1 = register("contact1", addIspValidation.contact1);
	formValidation.email1 = register("email1", addIspValidation.email1);
	formValidation.email2 = register("email2", addIspValidation.email2);
	formValidation.address = register("address", addIspValidation.address);

	const [formData, setFormData] = useState(defaultFormData);
	const [state, setState] = useState("");
	const [districtList, setDistrictList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [dataEdited, setDataEdited] = useState(false);
	const [superIsp, setSuperIsp] = useState(0);

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	const fetchDistrictList = async () => {
		setDistrictList([]);
		setFormData({ ...formData, district_id: "", city_id: "" });
		if (!formData.state_id) return;
		const payload = {
			state_id: formData.state_id,
		};
		const districtList = await getDistrictList(payload);
		setDistrictList(districtList?.list);
	};

	const fetchCityList = async () => {
		setCityList([]);
		setFormData({ ...formData, city_id: "" });
		if (!formData.state_id || !formData.district_id) return;
		const payload = {
			state_id: formData.state_id,
			district_id: formData.district_id,
		};
		const cityList = await getCityList(payload);
		setCityList(cityList?.list);
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

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		if (key != "state_id") {
			setDataEdited(true);
		}
	};

	useEffect(() => {
		if (formData.category) {
			setFormData({ ...formData, category: formData.category });
			setValue("category", formData.category, {
				shouldValidate: true,
			});
		} else if (formData.category == null) {
			setValue("category", "", {
				shouldValidate: true,
			});
		}
	}, [formData.category]);

	const togglePreviewModal = () => {
		if (!isLoading) {
			setShowPreviewModal(!showPreviewModal);
		}
	};

	const handleFormSubmit = async () => {
		setIsLoading(true);
		const checkedFormData = {
			...formData,
			state_id: formData.state_id || 16,
			district_id: formData.district_id || 3,
			city_id: formData.city_id || 3,
			email: formData.email1,
			mobile: formData.contact1,
		};
		const response = await addStackHolder(checkedFormData);
		setIsLoading(false);

		if (response.success) {
			router.push("/isp/details/" + response.oper_id);
			// showAlert(messages.ISP_CREATE_SUCCESS, 1);
		} else {
			// showAlert(response.msg);
		}
	};

	const handleBack = () => {
		router.push("/isp");
	};

	const handleError = (error) => {
		console.log("error", error);
		if (errors.oper_name || errors.category || errors.critical_balance || errors.sap_code) {
			if (jQuery("#primaryDetails").children().children().hasClass("collapsed")) {
				jQuery("#primaryDetails").children().children().trigger("click");
			}
		} else if (errors.contact1 || errors.email1 || errors.email2 || errors.address) {
			if (jQuery("#contactDetails").children().children().hasClass("collapsed")) {
				jQuery("#contactDetails").children().children().trigger("click");
			}
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(togglePreviewModal, handleError)}>
				<Accordion
					defaultActiveKey="0"
					className={style.subscriberAccordion}
				>
					<Accordion.Item
						eventKey="0"
						id="primaryDetails"
						className={style.subscriberAccordionItem}
					>
						<Accordion.Header className={style.subscriberAccordionHeader}>
							Organization Details
						</Accordion.Header>
						<Accordion.Body className={style.subscriberAccordionBody}>
							<div className={style.Detailsinner}>
								<div className={style.brdtopopdtl}>
									<div className={style.detlcoln}>
										<label>ISP Name</label>
										<div className={style.inptrel}>
											<input
												{...formValidation.oper_name}
												onChange={(e) => {
													formValidation.oper_name.onChange(e);
													updateSelectedForm("oper_name", e.target.value);
												}}
												type="text"
												name="oper_name"
												id="oper_name"
												placeholder="Enter ISP Name"
												maxLength={inputMaxLength}
											/>
											{errors?.oper_name && (
												<span className={style.logerror}>
													{errors.oper_name?.message}
												</span>
											)}
										</div>
									</div>

									{/* {user.user_type == "internal" && (
										<div className={style.detlcoln}>
											<label>Category</label>
											<div className={style.customselect}>
												{user.user_type == "super isp" ? (
													<select
														{...formValidation.category}
														name="category"
														id="category"
														defaultValue={category[0]?.cat_id ?? ""}
													>
														{categoryList.map((x, i) => (
															<option
																key={i}
																value={x.cat_id}
															>
																{x.name}
															</option>
														))}
													</select>
												) : (
													<select
														{...formValidation.category}
														name="category"
														id="category"
														defaultValue=""
														onChange={(e) => {
															formValidation.category.onChange(e);
															updateSelectedForm(
																"category",
																parseInt(e.target.value)
															);
														}}
													>
														<option value="">Select</option>
														{categoryList.map((x, i) => (
															<option
																key={i}
																value={x.cat_id}
															>
																{x.name}
															</option>
														))}
													</select>
												)}
												{errors?.category && (
													<span className={style.logerror}>
														{errors.category?.message}
													</span>
												)}
											</div>
										</div>
									)}

									

									{/* {user.user_type == "internal" && (
										<div className={style.detlcoln}>
											<label>
												SAP Code<span>Optional</span>
											</label>
											<div className={style.inptrel}>
												<input
													{...formValidation.sap_code}
													onChange={(e) => {
														formValidation.sap_code.onChange(e);
														updateSelectedForm(
															"sap_code",
															e.target.value
														);
													}}
													type="text"
													name="sap_code"
													id="sap_code"
													placeholder="Enter SAP Code"
													maxLength={20}
												/>
												{errors?.sap_code && (
													<span className={style.logerror}>
														{errors.sap_code?.message}
													</span>
												)}
											</div>
										</div>
									)} */}

									{/* <div className={style.detlcoln}>
										<label>
											Super ISP<span>Optional</span>
										</label>
										<div className={`${style.inptrel} ${style.multisearch}`}>
											<SelectMultiSearch
												// defaultSelected={formData.state_id}
												data={superIspList}
												id="superIsp"
												placeholder="Select Super ISP"
												noOptionsText="No Super ISP found"
												callback={setSuperIsp}
											/>
										</div>
									</div> */}

									{/* {user.user_type == "internal" && (
										<div className={style.detlcoln}>
											<label>
												Partner Type<span>Optional</span>
											</label>
											<div className={`${style.inptrel}`}>
												<div className={style.customSelectWrap}>
													<div className={style.customselect}>
														<select
															name="partner_type"
															id="partner_type"
															value={formData.partner_type}
															onChange={(e) => {
																updateSelectedForm(
																	"partner_type",
																	e.target.value
																);
															}}
														>
															<option value={""}>Select</option>
															{partnerTypeList.map((x, i) => (
																<option
																	key={i}
																	value={x.value}
																>
																	{x.label}
																</option>
															))}
														</select>
													</div>
												</div>
											</div>
										</div>
									)} */}

									{/* {user.user_type == "internal" && (
										<div className={style.detlcoln}>
											<label>
												API Version<span>Optional</span>
											</label>
											<div className={style.inptrel}>
												<input
													onChange={(e) => {
														updateSelectedForm(
															"api_version",
															e.target.value
														);
													}}
													type="text"
													name="api_version"
													id="api_version"
													placeholder="Enter API Version"
													maxLength={7}
												/>
											</div>
										</div>
									)} */}
								</div>
							</div>
						</Accordion.Body>
					</Accordion.Item>

					<Accordion.Item
						eventKey="1"
						id="contactDetails"
						className={style.subscriberAccordionItem}
					>
						<Accordion.Header className={style.subscriberAccordionHeader}>
							Contact Details
						</Accordion.Header>
						<Accordion.Body className={style.subscriberAccordionBody}>
							<div className={style.brdtop}>
								<div className={style.detlcol}>
									<div className={style.tworowcol}>
										<label>Contact Number</label>
										<div className={style.inptrel}>
											<input
												{...formValidation.contact1}
												onChange={(e) => {
													formValidation.contact1.onChange(e);
													updateSelectedForm("contact1", e.target.value);
												}}
												type="text"
												name="contact1"
												id="contact1"
												placeholder="Enter Mobile Number"
												maxLength={inputMaxLength}
											/>
											{errors?.contact1 && (
												<span className={style.logerror}>
													{errors.contact1?.message}
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
													updateSelectedForm("email1", e.target.value);
												}}
												type="text"
												name="email1"
												id="email1"
												placeholder="Primary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.email1 && (
												<span className={style.logerror}>
													{errors.email1?.message}
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
													updateSelectedForm("email2", e.target.value);
												}}
												type="text"
												name="email2"
												id="email2"
												placeholder="Secondary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.email2 && (
												<span className={style.logerror}>
													{errors.email2?.message}
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
															e.target.value,
														);
													}}
													name="address"
													id="address"
													placeholder="Add Address"
													maxLength={textareaMaxLength}
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
										<div className={`${style.detailCol2} ${style.colspan2}`}>
											<label>
												State<span>Optional</span>
											</label>

											<SelectMultiSearch
												defaultSelected={formData.state_id}
												data={stateList.list}
												id="state"
												placeholder="States"
												noOptionsText="No states found"
												callback={setState}
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
															parseInt(e.target.value),
														);
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
															parseInt(e.target.value),
														);
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
						</Accordion.Body>
					</Accordion.Item>

					{/* <Accordion.Item
						eventKey="2"
						id="spocDetails"
						className={style.subscriberAccordionItem}
					>
						<Accordion.Header className={style.subscriberAccordionHeader}>
							OTTPlay Internal SPOC
						</Accordion.Header>
						<Accordion.Body className={style.subscriberAccordionBody}>
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
														e.target.value,
													);
												}}
												type="text"
												name="finance_email1"
												id="finance_email1"
												placeholder="Primary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.finance_email1 && (
												<span className={style.logerror}>
													{errors.finance_email1?.message}
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
														e.target.value,
													);
												}}
												type="text"
												name="finance_email2"
												id="finance_email2"
												placeholder="Secondary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.finance_email2 && (
												<span className={style.logerror}>
													{errors.finance_email2?.message}
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
														e.target.value,
													);
												}}
												type="text"
												name="business_email1"
												id="business_email1"
												placeholder="Primary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.business_email1 && (
												<span className={style.logerror}>
													{errors.business_email1?.message}
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
														e.target.value,
													);
												}}
												type="text"
												name="business_email2"
												id="business_email2"
												placeholder="Secondary Email ID"
												maxLength={inputMaxLength}
											/>
											{errors?.business_email2 && (
												<span className={style.logerror}>
													{errors.business_email2?.message}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</Accordion.Body>
					</Accordion.Item> */}
				</Accordion>
				<div className={style.addbtn}>
					<button
						type="button"
						className="commonBtn borderBtn"
						onClick={handleBack}
					>
						Back
					</button>

					<button
						type="submit"
						className="commonBtn dark"
						disabled={!dataEdited}
					>
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
						<span>Preview ISP Details</span>
						<span
							className="closesetsub"
							onClick={togglePreviewModal}
						></span>
					</div>
					<div className={style.cancelPlanModalWrap}>
						<div className={style.inner}>
							<h4 className={style.heading}>Organization Details</h4>

							<div className={style.dtlpop}>
								<div className={style.brdtop}>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>ISP Name</label>
											<div className={style.datecoln}>
												{formData.oper_name ?? "---"}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className={style.inner}>
							<h4 className={style.heading}>Contact Details</h4>

							<div className={style.dtlpop}>
								<div className={style.brdtop}>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>Contact No</label>
											<div className={style.datecoln}>
												{formData.contact1 ?? "---"}
											</div>
										</div>
									</div>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>Email</label>
											<div className={style.datecoln}>
												{formData.email1 ?? "---"}
											</div>
										</div>
									</div>
								</div>
								<div className={style.brdtop}>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>Secondary Email</label>
											<div className={style.datecoln}>
												{formData.email2 ?? "---"}
											</div>
										</div>
									</div>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>Address</label>
											<div className={style.datecoln}>
												{formData.address ?? "---"}
											</div>
										</div>
									</div>
								</div>
								<div className={style.brdtop}>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>State</label>
											<div className={style.datecoln}>
												{stateList?.list?.find(
													(state) =>
														state.id === Number(formData.state_id),
												)?.label || "---"}
											</div>
										</div>
									</div>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>District</label>
											<div className={style.datecoln}>
												{districtList?.find(
													(district) =>
														district.id ===
														Number(formData.district_id),
												)?.name || "---"}
											</div>
										</div>
									</div>
								</div>
								<div className={style.brdtop}>
									<div className={style.twocol2}>
										<div className={style.detlcol}>
											<label>City</label>
											<div className={style.datecoln}>
												{cityList?.find(
													(city) => city.id === Number(formData.city_id),
												)?.name || "---"}
											</div>
										</div>
									</div>
								</div>
							</div>
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
