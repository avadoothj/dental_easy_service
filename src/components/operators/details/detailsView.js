"use client";
import { Accordion } from "react-bootstrap";
import style from "@/css/operator/operator.module.scss";
import CustomImage from "@/common/customImage";
import { editIcon, lockIcon } from "@/utils/imagesPicker";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCityList, getDistrictList } from "@/controllers/common";
import messages from "@/utils/messages";
import { formatPrice, getConstant } from "@/utils/utils";
import { AppContext } from "@/contextProvider";
import { editOperator } from "@/controllers/operators";
import { addOperatorValidation } from "@/utils/formValidation";
import SelectMultiSearch from "@/components/common/selectMultiSearch";
import Link from "next/link";

export default function DetailsView({ user, operator, stateList }) {
	const {
		register: register1,
		handleSubmit: handleSubmit1,
		formState: { errors: errors1 },
		reset: reset1,
	} = useForm();

	const { handleSubmit, reset } = useForm();

	const { showAlert } = useContext(AppContext);

	const defaultFormData = {
		oper_id: operator.oper_id,
		oper_code: operator.oper_code,
		oper_name: operator.oper_name,
		available_balance: operator.available_balance,
		no_of_users: operator.no_of_users,
		mobile: operator.mobile,
		email: operator.email,
		address: operator.address,
		state_id: operator.state_id,
		district_id: operator.district_id,
		city_id: operator.city_id,
		auto_renewal_hold_days: operator.auto_renewal_hold_days,
	};

	const formValidation = {
		oper_name: register1("oper_name", addOperatorValidation.oper_name),
		mobile: register1("mobile", addOperatorValidation.mobile),
		email: register1("email", addOperatorValidation.email),
		address: register1("address", addOperatorValidation.address),
		auto_renewal_hold_days: register1(
			"auto_renewal_hold_days",
			addOperatorValidation.auto_renewal_hold_days
		),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [state, setState] = useState("");
	const [districtList, setDistrictList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [isPrimaryEditable, setIsPrimaryEditable] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formUpdate, setFormUpdate] = useState(false);

	useEffect(() => {
		fetchDefaultLocations();
	}, []);

	const fetchDefaultLocations = async () => {
		try {
			await fetchDistrictList();
			await fetchCityList(true);
		} catch (error) {
			console.log("default location error", error);
		}
	};

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
	}, [isPrimaryEditable, isEditable]);

	const addRemoveClass = () => {
		if (isPrimaryEditable || isEditable) {
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
		fetchCityList();
	}, [formData.district_id]);

	const handleChangeEditable = (type) => {
		if (type === "cancelPrimary") {
			setFormData((prev) => ({
				...prev,
				oper_name: defaultFormData.oper_name,
				mobile: defaultFormData.mobile,
				email: defaultFormData.email,
				address: defaultFormData.address,
			}));
			reset1({
				oper_name: defaultFormData.oper_name,
				mobile: defaultFormData.mobile,
				email: defaultFormData.email,
				address: defaultFormData.address,
			});
			setIsPrimaryEditable((prev) => !prev);
		} else if (type === "editPrimary") {
			setIsPrimaryEditable((prev) => !prev);
		} else if (type === "cancel") {
			setFormData((prev) => ({
				...prev,
				state_id: defaultFormData.state_id,
				district_id: defaultFormData.district_id,
				city_id: defaultFormData.city_id,
			}));
			setIsEditable((prev) => !prev);
		} else if (type === "edit") {
			setIsEditable((prev) => !prev);
		}
	};

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		setFormUpdate(true);
	};

	const handleFormSubmit1 = async () => {
		const checkedFormData = {
			...formData,
			state_id: defaultFormData.state_id,
			district_id: defaultFormData.district_id,
			city_id: defaultFormData.city_id,
		};

		if (
			checkedFormData.auto_renewal_hold_days &&
			(parseInt(checkedFormData.auto_renewal_hold_days) > 90 ||
				parseInt(checkedFormData.auto_renewal_hold_days) < 0)
		) {
			showAlert(messages.REQUIRED_AUTO_RENEWAL_HOLD_DAYS);
			return false;
		}
		setIsLoading(true);
		const response = await editOperator(checkedFormData);
		setIsLoading(false);
		if (response.success) {
			showAlert(messages.OPERATOR_EDIT_SUCCESS, 1);
			setIsPrimaryEditable(false);
			setIsEditable(false);
			setFormData(checkedFormData);
			reset(checkedFormData);
		} else {
			showAlert(response.msg);
		}
	};

	const handleFormSubmit = async () => {
		setIsLoading(true);

		const checkedFormData = {
			...defaultFormData,
			state_id: formData.state_id || 16,
			district_id: formData.district_id || 3,
			city_id: formData.city_id || 3,
		};

		const response = await editOperator(checkedFormData);
		setIsLoading(false);
		if (response.success) {
			showAlert(messages.OPERATOR_EDIT_SUCCESS, 1);
			setIsPrimaryEditable(false);
			setIsEditable(false);

			setFormData(checkedFormData);
			reset1(checkedFormData);
		} else {
			showAlert(response.msg);
		}
	};

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const textAreaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

	return (
		<Accordion
			defaultActiveKey="0"
			className={style.operatorAccordion}
		>
			<Accordion.Item
				eventKey="0"
				className={style.operatorAccordionItem}
			>
				<Accordion.Header className={style.operatorAccordionHeader}>
					Primary Details
					<CustomImage
						alt="editIcon"
						src={editIcon}
						width="17"
						height="17"
					/>
				</Accordion.Header>
				<Accordion.Body className={style.operatorAccordionBody}>
					<div className={style.Detailsinner}>
						{!isPrimaryEditable && (
							<>
								<div className={style.primaryRow2}>
									{user.user_type == "internal" && (
										<div className={style.primaryCol1}>
											<label>ISP </label>
											<div className={style.inputDetails}>
												{operator.isp_name}
											</div>
										</div>
									)}
									<div className={style.primaryCol1}>
										<label>Operator Name </label>
										<div className={style.inputDetails}>
											{formData.oper_name}
										</div>
									</div>
									<div className={style.primaryCol1}>
										<label>Operator Code</label>
										<div className={style.inputDetails}>
											{formData.oper_code}
										</div>
									</div>
									<div className={style.primaryCol1}>
										<label>Available Balance</label>
										<div className={style.inputDetails}>
											{formatPrice(formData.available_balance)}
										</div>
									</div>
									<div className={style.primaryCol1}>
										<label>No of Users</label>
										<div className={style.inputDetails}>
											{formData.no_of_users}
										</div>
									</div>

									<div className={style.primaryCol1}>
										<label>Contact Number</label>
										<div className={style.inputDetails}>
											{formData.mobile ? formData.mobile : "---"}
										</div>
									</div>
									{/* remove classes style.emai and style.address as discuss with sushant */}
									<div className={`${style.primaryCol1} `}>
										<label>Email ID</label>
										<div className={`${style.inputDetails} ${style.wordBreak}`}>
											{formData.email ? formData.email : "---"}
										</div>
									</div>
									<div className={`${style.primaryCol1} `}>
										<label>Address</label>
										<div className={`${style.inputDetails} ${style.wordBreak}`}>
											{formData.address ? formData.address : "---"}
										</div>
									</div>
									<div className={`${style.primaryCol1} `}>
										<label>Dynamic AR (with a delay)</label>
										<div className={style.inputDetails}>
											{formData.auto_renewal_hold_days
												? formData.auto_renewal_hold_days
												: 0}
										</div>
									</div>
								</div>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<div className={style.editWrap}>
										<Link
											onClick={() => handleChangeEditable("editPrimary")}
											href="#"
										>
											Edit Details
										</Link>
									</div>
								)}
							</>
						)}

						{isPrimaryEditable && (
							<>
								<form onSubmit={handleSubmit1(handleFormSubmit1)}>
									<div className={style.primaryRow2}>
										{user.user_type == "internal" && (
											<div className={style.primaryCol1}>
												<label>ISP</label>
												<div className={style.inputDetails}>
													{operator.isp_name}
												</div>
											</div>
										)}
										<div className={style.primaryCol1}>
											<label>Operator Code</label>
											<div className={style.inputDetails}>
												{formData.oper_code}
											</div>
										</div>
										<div className={style.primaryCol1}>
											<label>Available Balance</label>
											<div className={style.inputDetails}>
												{formatPrice(formData.available_balance)}
											</div>
										</div>
										<div className={style.primaryCol1}>
											<label>No of Users</label>
											<div className={style.inputDetails}>
												{formData.no_of_users}
											</div>
										</div>
									</div>
									<div className={style.primaryRow3}>
										<div className={style.primaryCol1Wrap}>
											<div className={style.primaryCol1}>
												<label>Operator Name</label>
												<div className={style.inputsWrap}>
													<input
														{...formValidation.oper_name}
														onChange={(e) => {
															formValidation.oper_name.onChange(e);
															updateSelectedForm(
																"oper_name",
																e.target.value
															);
														}}
														type="text"
														name="oper_name"
														id="oper_name"
														value={formData.oper_name}
														placeholder="Enter Operator Name"
														maxLength={inputMaxLength}
													/>
													{errors1?.oper_name && (
														<span className={style.errorMsg}>
															{errors1.oper_name?.message}
														</span>
													)}
												</div>
											</div>

											<div className={style.primaryCol1}>
												<label>Contact Number</label>
												<div className={style.inputsWrap}>
													<input
														{...formValidation.mobile}
														onChange={(e) => {
															formValidation.mobile.onChange(e);
															updateSelectedForm(
																"mobile",
																e.target.value
															);
														}}
														value={formData.mobile}
														type="text"
														name="mobile"
														id="mobile"
														placeholder="Enter Contact Number"
														maxLength="10"
													/>
													{errors1?.mobile && (
														<span className={style.errorMsg}>
															{errors1.mobile?.message}
														</span>
													)}
												</div>
											</div>

											<div className={`${style.primaryCol1} ${style.email}`}>
												<label>Email ID</label>
												<div className={style.inputsWrap}>
													<input
														{...formValidation.email}
														onChange={(e) => {
															formValidation.email.onChange(e);
															updateSelectedForm(
																"email",
																e.target.value
															);
														}}
														value={formData.email}
														type="text"
														name="email"
														id="email"
														placeholder="Enter Email ID"
														maxLength={inputMaxLength}
													/>
													{errors1?.email && (
														<span className={style.errorMsg}>
															{errors1.email?.message}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className={style.primaryCol1Wrap}>
											<div
												className={`${style.primaryCol1} ${style.address}`}
											>
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
														}}
														value={formData.address}
														name="address"
														id="address"
														placeholder="Enter Address"
														maxLength={textAreaMaxLength}
													/>
													{errors1?.address && (
														<span className={style.errorMsg}>
															{errors1.address?.message}
														</span>
													)}
												</div>
											</div>
											<div className={style.primaryCol1}>
												<label>Dynamic AR (with a delay)</label>
												<div className={style.inputsWrap}>
													<input
														{...formValidation.auto_renewal_hold_days}
														onChange={(e) => {
															formValidation.auto_renewal_hold_days.onChange(
																e
															);
															updateSelectedForm(
																"auto_renewal_hold_days",
																e.target.value
															);
														}}
														value={formData.auto_renewal_hold_days}
														type="text"
														name="auto_renewal_hold_days"
														id="auto_renewal_hold_days"
														placeholder="Enter auto renewal hold days"
														maxLength="2"
													/>
													{errors1?.auto_renewal_hold_days && (
														<span className={style.errorMsg}>
															{
																errors1.auto_renewal_hold_days
																	?.message
															}
														</span>
													)}
												</div>
											</div>
											<div className={style.editWrap2}>
												<div className={style.btnWrapper3}>
													<button
														type="button"
														className="commonBtn borderBtn"
														onClick={() =>
															handleChangeEditable("cancelPrimary")
														}
													>
														Cancel
													</button>
													<button
														type="submit"
														className="commonBtn dark"
														disabled={isLoading || !formUpdate}
													>
														{isLoading
															? getConstant("LOADING_TEXT")
															: "Save"}
													</button>
												</div>
											</div>
										</div>
									</div>
								</form>
							</>
						)}
					</div>
				</Accordion.Body>
			</Accordion.Item>

			<Accordion.Item
				eventKey="1"
				className={style.operatorAccordionItem}
			>
				<Accordion.Header className={style.operatorAccordionHeader}>
					Optional Details
					<CustomImage
						alt="edit"
						src={editIcon}
						width="17"
						height="17"
					/>
				</Accordion.Header>
				<Accordion.Body className={style.operatorAccordionBody}>
					<div className={style.Detailsinner}>
						{isEditable ? (
							<form onSubmit={handleSubmit(handleFormSubmit)}>
								<div className={style.optionalRow1}>
									<div className={style.optionalCol1}>
										<label>State</label>
										<SelectMultiSearch
											defaultSelected={formData.state_id}
											data={stateList}
											id="state"
											placeholder="States"
											noOptionsText="No states found"
											callback={setState}
										/>
									</div>
									<div className={style.optionalCol1}>
										<label>District</label>
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
												}}
											>
												<option value={0}>Select</option>
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
									<div className={style.optionalCol1}>
										<label>City</label>
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
												}}
											>
												<option value={0}>Select</option>
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

								<div className={style.editWrap}>
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
								<div className={style.optionalRow2}>
									<div className={style.optionalCol1}>
										<label>State</label>
										<div className={style.inputDetails}>
											{stateList.find(
												(state) => state.id == formData.state_id
											)?.name || "---"}
										</div>
									</div>
									<div className={style.optionalCol1}>
										<label>District</label>
										<div className={style.inputDetails}>
											{districtList.find(
												(district) => district.id == formData.district_id
											)?.name || "---"}
										</div>
									</div>
									<div className={style.optionalCol1}>
										<label>City</label>
										<div className={style.inputDetails}>
											{cityList.find((city) => city.id == formData.city_id)
												?.name || "---"}
										</div>
									</div>
								</div>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<div className={style.editWrap}>
										<Link
											onClick={() => handleChangeEditable("edit")}
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
