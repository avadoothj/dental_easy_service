"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OttDetails from "@/components/plans/ottDetails";
import { formatPrice, getConstant, getPlanDuration } from "@/utils/utils";
import { setPlanPrice } from "@/utils/formValidation";
import commonStyle from "@/css/common/common.module.scss";
import { addPlanRate } from "@/controllers/plans";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import style from "@/css/operator/operator.module.scss";

export default function PlanPriceSet({
	operator,
	planDetail,
	handleSavePlanClick,
	handlePlanPriceBackBtn,
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { showAlert, user } = useContext(AppContext);

	const defaultFormData = {
		plan_price: planDetail.operator_price ?? "",
		plan_id: planDetail.bouquet_id,
	};

	const formValidation = {
		plan_price: register("plan_price", setPlanPrice.plan_price),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [basicPrice, setBasicPrice] = useState(0);
	const [taxAmount, setTaxAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [formUpdate, setFormUpdate] = useState(false);

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
		if (
			user?.user_type == "isp" ||
			user?.user_type == "internal" ||
			user?.user_type == "super isp"
		) {
			formData.oper_id = [operator.oper_id];
		}

		setIsLoading(true);
		const response = await addPlanRate(formData, true);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.PLAN_RATE_ADD_SUCCESS, 1);
		} else {
			showAlert(response.msg);
		}
		handleSavePlanClick();
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
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.PlansSetPrice}>
					<h2>Set Price for Operator</h2>
					<div className={`${style.row1} ${style.mOrder3}`}>
						<div className={style.col}>
							<div className={style.label}>Plan Duration</div>
							<div className={style.data}>{getPlanDuration(planDetail)}</div>
						</div>
						<div className={style.col}>
							<div className={style.label}>Plan Price</div>
							<div className={style.data}>{formatPrice(planDetail.your_price)}</div>
						</div>
					</div>
					<div className={`${style.row2} ${style.mOrder2}`}>
						<div className={style.col}>Plan</div>
						<div className={style.col}>
							<b>{planDetail.bouquet_name}</b>
						</div>
					</div>
					<div className={`${style.row2} ${style.mOrder4}`}>
						<div className={style.col}>Operator Price</div>
						<div className={`${style.col} ${style.inputCol}`}>
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
							{errors?.plan_price && (
								<span className={commonStyle.logerror}>
									{errors.plan_price?.message}
								</span>
							)}
						</div>
					</div>
					<div className={`${style.row1} ${style.mOrder5}`}>
						<div className={style.col}>
							<div className={style.label}>Basic</div>
							<div className={style.data}>{formatPrice(basicPrice, 2)}</div>
						</div>
						<div className={style.col}>
							<div className={style.label}>Tax</div>
							<div className={style.data}>{formatPrice(taxAmount, 2)}</div>
						</div>
					</div>
					<div className={`${style.row2} ${style.mOrder6}`}>
						<div className={style.col}>Plan Code</div>
						<div className={style.col}>
							<b>{planDetail.bouquet_code}</b>
						</div>
					</div>
					<div className={`${style.row2} ${style.mOrder7}`}>
						<div className={style.col}>OTTs ({planDetail.channels.length})</div>
						<OttDetails
							ottList={planDetail.channels}
							showAll={true}
						/>
					</div>
				</div>

				<div className={style.btnWrapper}>
					<button
						type="button"
						className="commonBtn borderBtn"
						onClick={handlePlanPriceBackBtn}
					>
						Back
					</button>
					<button
						type="submit"
						className="commonBtn dark "
						disabled={isLoading || !formUpdate}
					>
						{isLoading ? getConstant("LOADING_TEXT") : "Save"}
					</button>
				</div>
			</form>
		</>
	);
}
