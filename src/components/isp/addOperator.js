"use client";
import React, { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "@/css/operator/operator.module.scss";
import { AppContext } from "@/contextProvider";
import { addOperatorValidation, addOperatorForIsp } from "@/utils/formValidation";
import CommonModal from "@/common/commonModal";
import CustomImage from "@/common/customImage";
import { getConstant } from "@/utils/utils";
import { editIcon } from "@/utils/imagesPicker";
import messages from "@/utils/messages";
import { getCityList, getDistrictList } from "@/controllers/common";
import { addNewOperator } from "@/controllers/operators";
import SelectMultiSearch from "@/common/selectMultiSearch";
import { getIspList } from "@/controllers/partners";

export default function AddOperatorForm({ user, stateList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const router = useRouter();
	const { showAlert } = useContext(AppContext);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const textAreaMaxLength = getConstant("TEXT_AREA_MAXLENGTH");

	const defaultFormData = {
		oper_name: "",
		mobile: "",
		email: "",
		address: "",
		state_id: "",
		city_id: "",
		district_id: "",
	};

	const formValidation = {
		oper_name: register("oper_name", addOperatorValidation.oper_name),
		email: register("email", addOperatorValidation.email),
		mobile: register("mobile", addOperatorValidation.mobile),
		address: register("address", addOperatorValidation.address),
	};

	if (user.user_type == "internal") {
		formValidation.ispId = register("ispId", addOperatorForIsp.isp_id);
	}

	const [formData, setFormData] = useState(defaultFormData);
	const [state, setState] = useState("");
	const [districtList, setDistrictList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showPreviewModal, setShowPreviewModal] = useState(false);
	const [dataEdited, setDataEdited] = useState(false);

	const fetchDistrictList = async () => {
		setDistrictList([]);
		setFormData({ ...formData, district_id: "", city_id: "" });
		if (!formData.state_id) return;
		const payload = {
			state_id: formData.state_id,
		};
		const districtList = await getDistrictList(payload);
		setDistrictList(districtList);
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
		setCityList(cityList);
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

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		setDataEdited(true);
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
			state_id: formData.state_id || 16,
			district_id: formData.district_id || 3,
			city_id: formData.city_id || 3,
		};

		const response = await addNewOperator(checkedFormData);
		setIsLoading(false);

		if (response.success) {
			router.push("/operators/details/" + response.oper_id);
			showAlert(messages.OPERATOR_CREATE_SUCCESS, 1);
		} else {
			showAlert(response.msg);
		}
	};

	const handleBack = () => {
		router.push("/operators");
	};

	const handleError = (error) => {
		if (jQuery("#primaryDetails").children().children().hasClass("collapsed")) {
			jQuery("#primaryDetails").children().children().trigger("click");
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(togglePreviewModal, handleError)}>
				<Accordion
					defaultActiveKey="0"
					className={style.operatorAccordion}
				>
					<Accordion.Item
						eventKey="0"
						id="primaryDetails"
						className={style.operatorAccordionItem}
					>
						<Accordion.Header className={style.operatorAccordionHeader}>
							Primary Details
						</Accordion.Header>

						<Accordion.Body className={style.operatorAccordionBody}>
							<div className={style.Detailsinner}>
								<div className={style.primaryRow1}>
									<div className={style.primaryCol1}>
										<label>Operator Name</label>
										<div className={style.inputsWrap}>
											<input
												{...formValidation.oper_name}
												onChange={(e) => {
													formValidation.oper_name.onChange(e);
													updateSelectedForm("oper_name", e.target.value);
												}}
												value={formData.oper_name}
												type="text"
												name="oper_name"
												id="oper_name"
												placeholder="Enter Operator Name"
												maxLength={inputMaxLength}
											/>
											{errors?.oper_name && (
												<span className={style.errorMsg}>
													{errors.oper_name?.message}
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
												<span className={style.errorMsg}>
													{errors.mobile?.message}
												</span>
											)}
										</div>
									</div>
									<div className={style.primaryCol1}>
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
												<span className={style.errorMsg}>
													{errors.email?.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className={style.primaryRow1}>
									<div className={style.primaryCol2}>
										<label>Address</label>
										<div className={style.inputsWrap}>
											<textarea
												{...formValidation.address}
												onChange={(e) => {
													formValidation.address.onChange(e);
													updateSelectedForm("address", e.target.value);
												}}
												rows={2}
												cols={2}
												value={formData.address}
												name="address"
												id="address"
												placeholder="Enter Address"
												maxLength={textAreaMaxLength}
											/>
											{errors?.address && (
												<span className={style.errorMsg}>
													{errors.address?.message}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</Accordion.Body>
					</Accordion.Item>

					<Accordion.Item
						eventKey="1"
						id="optionalDetails"
						className={style.operatorAccordionItem}
					>
						<Accordion.Header className={style.operatorAccordionHeader}>
							Optional Details
						</Accordion.Header>
						<Accordion.Body className={style.operatorAccordionBody}>
							<div className={style.Detailsinner}>
								<div className={style.optionalRow1}>
									<div className={style.optionalCol1}>
										<label>State</label>

										<SelectMultiSearch
											data={stateList}
											id="state"
											placeholder="States"
											noOptionsText="No states found"
											callback={setState}
										/>
									</div>
									<div className={style.optionalCol1}>
										<label>District</label>
										<div className={style.customSelectWrap}>
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
									</div>
									<div className={style.optionalCol1}>
										<label>City</label>
										<div className={style.customSelectWrap}>
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
								</div>
							</div>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<div className={style.btnWrapper}>
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
						<span>Preview Operator Details</span>
						<span
							className="closesetsub"
							onClick={togglePreviewModal}
						></span>
					</div>
					<div className={style.operatorDetailModalWrap}>
						<div className={style.inner}>
							<h4 className={style.heading}>
								Primary Details{" "}
								<CustomImage
									alt="edit"
									src={editIcon}
									width="17"
									height="17"
								/>
							</h4>

							<div className={style.row}>
								<p className={style.colLeft}>Operator Name</p>
								<p className={style.colRight}>
									<span>{formData.oper_name}</span>
								</p>
							</div>

							<div className={style.row}>
								<p className={style.colLeft}>Contact No</p>
								<p className={style.colRight}>
									<span>{formData.mobile}</span>
								</p>
							</div>
							<div className={style.row}>
								<p className={style.colLeft}>Email ID</p>
								<p className={style.colRight}>
									<span>{formData.email ? formData.email : "---"}</span>
								</p>
							</div>

							<div className={style.row}>
								<p className={style.colLeft}>Address</p>
								<p className={style.colRight}>
									<span>{formData.address ? formData.address : "---"}</span>
								</p>
							</div>
						</div>
						<div className={style.inner}>
							<h4 className={style.heading}>
								Optional Details{" "}
								<CustomImage
									alt="edit"
									src={editIcon}
									width="17"
									height="17"
								/>
							</h4>
							<div className={style.grid}>
								<div className={style.row}>
									<p className={style.colLeft}>State</p>
									<p className={style.colRight}>
										<span>
											{stateList.find(
												(state) => state.id == formData.state_id
											)?.name || "---"}
										</span>
									</p>
								</div>

								<div className={style.row}>
									<p className={style.colLeft}>District</p>
									<p className={style.colRight}>
										<span>
											{districtList.find(
												(district) => district.id == formData.district_id
											)?.name || "---"}
										</span>
									</p>
								</div>

								<div className={style.row}>
									<p className={style.colLeft}>City</p>
									<p className={style.colRight}>
										<span>
											{cityList.find((city) => city.id == formData.city_id)
												?.name || "---"}
										</span>
									</p>
								</div>
							</div>
						</div>

						<div className={style.note}></div>
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
