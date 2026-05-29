"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OttDetails from "@/components/plans/ottDetails";
import { formatPrice, getConstant, getPlanDuration } from "@/utils/utils";
import { setPlanPrice } from "@/utils/formValidation";
import commonStyle from "@/css/common/common.module.scss";
import { addIspPlanRate } from "@/controllers/plans";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import SelectMultiSearch from "@/common/selectMultiSearch";

export default function SetIspPlanPrice({ planDetail, handleClose, reloadData, operatorList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const { showAlert, user } = useContext(AppContext);

	const defaultFormData = {
		plan_price: planDetail.subscriber_price ?? "",
		plan_id: planDetail.bouquet_id,
	};

	const priceSetFor = "ISP";

	if (user?.user_type != "isp") {
		delete setPlanPrice.operator;
	}

	const formValidation = {
		operator: register("operator", setPlanPrice.operator),
		plan_price: register("plan_price", setPlanPrice.plan_price),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [basicPrice, setBasicPrice] = useState(0);
	const [taxAmount, setTaxAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [formUpdate, setFormUpdate] = useState(false);
	const [selectedOperators, setSelectedOperators] = useState([]);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		setFormUpdate(true);
	};

	useEffect(() => {
		jQuery("#plan_price").trigger("focus");
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			calculateTax();
		}, 500);

		return () => clearTimeout(timeout);
	}, [formData.plan_price]);

	const handleSelectedOperators = (operatorList) => {
		setSelectedOperators(operatorList);
		setValue("operator", operatorList.join(","), { shouldValidate: true });
		setFormUpdate(true);
	};

	const calculateTax = () => {
		const basicPrice =
			(parseFloat(formData.plan_price).toFixed(2) * 100) / getConstant("GST_TAX");
		const taxAmount =
			parseFloat(formData.plan_price) -
			parseFloat((parseFloat(formData.plan_price).toFixed(2) * 100) / getConstant("GST_TAX"));

		setBasicPrice(basicPrice);
		setTaxAmount(taxAmount);
	};

	const handleFormSubmit = async () => {
		if (user?.user_type == "super isp") {
			if (selectedOperators.length > 0) {
				formData.oper_id = selectedOperators;
			} else {
				showAlert(messages.OPERATOR_NOT_SELECTED);
				return false;
			}
		}

		setIsLoading(true);
		const response = await addIspPlanRate(formData);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.PLAN_RATE_ADD_SUCCESS, 1);
			handleClose();
			reloadData();
		} else {
			showAlert(response.msg);
		}
	};

	const handleNumberInput = (e) => {
		const key = e.key;
		const currentValue = e.currentTarget.value;

		const isDigit = /^[0-9]$/.test(key);
		const isDot = key === "." && !currentValue.includes(".");

		// Allow control keys
		const isControlKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
			key
		);

		// Prevent if not a digit, dot, or control key
		if (!isDigit && !isDot && !isControlKey) {
			e.preventDefault();
			return;
		}

		// Restrict to 2 digits after decimal
		const dotIndex = currentValue.indexOf(".");
		if (dotIndex > -1 && isDigit) {
			const decimalPlaces = currentValue.substring(dotIndex + 1);
			if (decimalPlaces.length >= 2 && e.currentTarget.selectionStart > dotIndex) {
				e.preventDefault();
				return;
			}
		}
	};

	return (
		<>
			<div className="setsubheader">
				<span>Set Price for {priceSetFor}</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<ul className="setsubmid">
					<div className="setprobs">Set Price for {priceSetFor}</div>
					<li id="a">
						<div className="setsubl">Plan</div>
						<div className="setsubr">{planDetail.bouquet_name}</div>
					</li>
					<div className="liWrapper">
						<li id="e">
							<div className="setsubl">Your Price</div>
							<div className="setsubr">{formatPrice(planDetail.your_price)}</div>
						</li>
						<li id="d">
							<div className="setsubl">Plan Duration</div>
							<div className="setsubr">{getPlanDuration(planDetail)}</div>
						</li>
					</div>
					{user?.user_type == "super isp" && (
						<li id="r">
							<div className="setsubl mt-10">ISP(s)</div>
							<div className="setsubr">
								<SelectMultiSearch
									data={operatorList}
									id="oper_selection"
									limitTags="1"
									showAllOption={true}
									multiple={true}
									showLabels={true}
									showCheckboxes={true}
									placeholder="Select ISPs"
									noOptionsText="No ISP found"
									callback={handleSelectedOperators}
									renderTags={false}
									style={{
										"&": { width: "80%" },
										"@media (max-width:600px)": { width: "100%" },
									}}
								/>
								{errors?.operator && (
									<span className={commonStyle.logerror}>
										{errors.operator?.message}
									</span>
								)}
							</div>
						</li>
					)}
					<li id="f">
						<div className="setsubl mt-10">{priceSetFor} Price</div>
						<div className="setsubr">
							<div className="formgroup">
								<span>₹</span>
								<input
									{...formValidation.plan_price}
									onChange={(e) => {
										formValidation.plan_price.onChange(e);
										updateSelectedForm("plan_price", e.target.value);
									}}
									onKeyDown={(e) => {
										handleNumberInput(e);
									}}
									className="formfield"
									type="text"
									placeholder="Enter Price In INR"
									name="plan_price"
									id="plan_price"
									value={formData.plan_price}
									maxLength="10"
								/>
							</div>
							{errors?.plan_price && (
								<span className={commonStyle.logerror}>
									{errors.plan_price?.message}
								</span>
							)}
							<div className="packval">
								<div className="colpl">
									Basic&nbsp;<span>{formatPrice(basicPrice, 2)}</span>
								</div>
								<div className="colpl">
									Tax&nbsp;<span>{formatPrice(taxAmount, 2)}</span>
								</div>
							</div>
						</div>
					</li>
					<li id="b">
						<div className="setsubl">Plan Code</div>
						<div className="setsubr">{planDetail.bouquet_code}</div>
					</li>
					<li id="c">
						<div className="setsubl">OTTs ({planDetail.channels.length})</div>
						<div className="setsubr">
							<OttDetails
								ottList={planDetail.channels}
								showAll={true}
							/>
						</div>
					</li>
				</ul>
				<div className="setsubfooter">
					<button
						type="button"
						className="backbutton"
						onClick={handleClose}
					>
						Back
					</button>
					<button
						type="submit"
						className="savebutton"
						disabled={isLoading || !formUpdate}
					>
						{isLoading ? getConstant("LOADING_TEXT") : "Save"}
					</button>
				</div>
			</form>
		</>
	);
}
