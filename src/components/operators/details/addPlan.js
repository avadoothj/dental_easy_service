"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "@/contextProvider";
import { getConstant } from "@/utils/utils";
import style from "@/css/team/team.module.scss";
import { addTeam } from "@/controllers/team";
import messages from "@/utils/messages";
import { useRouter } from "next/navigation";
import { paymentModes } from "@/utils/masterData";
import { getBankList } from "@/controllers/common";

export default function AddPlan() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const router = useRouter();
	const { showAlert, user } = useContext(AppContext);
	const [paymentMode, setPaymentMode] = useState("cash");
	const [bankList, setBankList] = useState([]);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const loginMaxLength = getConstant("MAXLENGTH_LOGIN_ID");

	const handlePaymentMode = async (mode) => {
		setPaymentMode(mode);
		if (mode == "cheque") {
			setBankList(await getBankList());
		}
	};

	const defaultFormData = {
		amount: "",
		remark: "",
	};

	const formValidation = {
		// amount: register("amount", loginValidation.amount),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleToggleClick = () => {
		setShowModal(!showModal);
	};

	const handleFormSubmit = async () => {
		setIsLoading(true);
		const response = await addTeam(formData);

		if (response.success) {
			showAlert(messages.USER_ADD_SUCCESS, 1);
			router.push("/team");
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.addmember}>
					<div className={style.memtoppanel}>
						<div className={style.sechead}>Enter Amount to Add Balance</div>
						<div className={style.brdtop}>
							<div className={style.detlcol}>
								<label>Enter Amount</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.amount}
										type="text"
										name="amount"
										id="amount"
										onChange={(e) => {
											formValidation.amount.onChange(e);
											updateSelectedForm("amount", e.target.value);
										}}
										maxLength={loginMaxLength}
									/>
									{errors?.amount && (
										<span className={style.logerror}>
											{errors.amount?.message}
										</span>
									)}
								</div>
							</div>
							<div className={style.detlcol}>
								<label>Remark</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.remark}
										type="text"
										name="remark"
										id="remark"
										onChange={(e) => {
											updateSelectedForm("remark", e.target.value);
										}}
										maxLength={inputMaxLength}
									/>
								</div>
							</div>
						</div>
						<p>Payment Mode</p>
						{paymentModes.map((mode, i) => (
							<>
								<input
									type="radio"
									id={mode}
									name="payment_mode"
									value={mode}
									onChange={(e) => {
										handlePaymentMode(e.target.value);
									}}
								/>
								&nbsp;
								<label key={i}>{mode}</label>
								<br />
							</>
						))}

						{paymentMode == "cheque" && (
							<select>
								{bankList.map((bank, i) => (
									<option value={bank.id}>{bank.name}</option>
								))}
							</select>
						)}
					</div>
					<div className={style.addbtn}>
						<button
							type="submit"
							className="commonBtn dark backdashboard"
							// disabled={isLoading || !dataEdited}
						>
							{isLoading ? getConstant("LOADING_TEXT") : "Save"}
						</button>
					</div>
				</div>
			</form>
			{/* <CommonModal
				show={showModal}
				handleClose={handleToggleClick}
				className="setpricemodel"
				bodyClassName="setpricepad"
				animation={false}
			>
				<Permissions
					permission={permission}
					role={roleName}
					handleClose={handleToggleClick}
				/>
			</CommonModal> */}
		</>
	);
}
