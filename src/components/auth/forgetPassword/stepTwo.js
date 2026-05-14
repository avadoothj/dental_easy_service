"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/css/auth/login.module.scss";
import { forgetPasswordStepTwo } from "@/utils/formValidation";
import { verifyOtp } from "@/controllers/forgetPassword";
import CustomImage from "@/components/common/customImage";
import { errorIconNew } from "@/utils/imagesPicker";
import { useRouter } from "next/navigation";

export default function StepTwo({
	displayMessage,
	username,
	setVerificationToken,
	prevStep,
	nextStep,
}) {
	const { push } = useRouter();
	const { register, setValue, handleSubmit } = useForm();

	const defaultFormData = useMemo(() => {
		// Initialize your default form data here
		return {
			otp_1: "",
			otp_2: "",
			otp_3: "",
			otp_4: "",
			otp_5: "",
			otp_6: "",
		};
	}, []); // Empty dependency array means this useMemo runs only once

	const formValidation = {
		otp_1: register("otp_1", forgetPasswordStepTwo.otp),
		otp_2: register("otp_2", forgetPasswordStepTwo.otp),
		otp_3: register("otp_3", forgetPasswordStepTwo.otp),
		otp_4: register("otp_4", forgetPasswordStepTwo.otp),
		otp_5: register("otp_5", forgetPasswordStepTwo.otp),
		otp_6: register("otp_6", forgetPasswordStepTwo.otp),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [authError, setAuthError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		document.getElementById("otp_1").focus();
	}, []);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const updateSelectedFormMulti = useCallback(
		(fieldsList) => {
			setFormData({
				...formData,
				...fieldsList,
			});
		},
		[formData, setFormData]
	);

	const handleTryAgain = () => {
		updateSelectedFormMulti(defaultFormData);
	};

	const focusOnNextField = (event) => {
		if (!event.ctrlKey) {
			const form = event.target.form;
			const index = Array.prototype.indexOf.call(form, event.target);
			if (event.keyCode === 8 || event.keyCode === 37) {
				if (typeof form.elements[index - 1] != "undefined") {
					form.elements[index - 1].focus();
				}
				event.preventDefault();
			} else if (event.target.value != "") {
				if (form.elements[index + 1]["type"] != "button") {
					form.elements[index + 1].focus();
				}
				event.preventDefault();
			}
		}
	};

	const handleCopyOtpAction = useCallback(() => {
		document.addEventListener("paste", (e) => {
			if (e.target.type === "text") {
				const temp = {};
				e.clipboardData
					.getData("Text")
					.split("")
					.map((v, i) => {
						temp["otp_" + (i + 1)] = v;
						setValue("otp_" + (i + 1), v);
					});
				updateSelectedFormMulti(temp);
			}
		});
	}, [setValue, updateSelectedFormMulti]);

	const handleFormSubmit = useCallback(async () => {
		setAuthError("");
		setIsLoading(true);

		const payload = {
			username: username,
			otp: `${formData.otp_1}${formData.otp_2}${formData.otp_3}${formData.otp_4}${formData.otp_5}${formData.otp_6}`,
		};

		const response = await verifyOtp(payload);

		if (response.success) {
			setVerificationToken(response.token);
			nextStep();
		} else {
			document.getElementById("otp_1").focus();
			updateSelectedFormMulti(defaultFormData);
			setIsLoading(false);
			setAuthError(response.msg);
		}
	}, [
		username,
		formData,
		setAuthError,
		setIsLoading,
		setVerificationToken,
		nextStep,
		updateSelectedFormMulti,
		defaultFormData,
	]);

	useEffect(() => {
		handleCopyOtpAction();
	}, [handleCopyOtpAction]);

	useEffect(() => {
		if (
			formData.otp_1 != "" &&
			formData.otp_2 != "" &&
			formData.otp_3 != "" &&
			formData.otp_4 != "" &&
			formData.otp_5 != "" &&
			formData.otp_6 != ""
		) {
			handleFormSubmit();
		}
	}, [formData, handleFormSubmit]);

	const goBack = () => {
		prevStep();
	};

	return (
		<>
			<div className={style.otptxt}>{displayMessage}</div>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.inputotp}>
					<input
						{...formValidation.otp_1}
						onChange={(e) => {
							formValidation.otp_1.onChange(e);
							updateSelectedForm("otp_1", e.target.value);
						}}
						type="text"
						name="otp_1"
						id="otp_1"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_1}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
					<input
						{...formValidation.otp_2}
						onChange={(e) => {
							formValidation.otp_2.onChange(e);
							updateSelectedForm("otp_2", e.target.value);
						}}
						type="text"
						name="otp_2"
						id="otp_2"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_2}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
					<input
						{...formValidation.otp_3}
						onChange={(e) => {
							formValidation.otp_3.onChange(e);
							updateSelectedForm("otp_3", e.target.value);
						}}
						type="text"
						name="otp_3"
						id="otp_3"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_3}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
					<input
						{...formValidation.otp_4}
						onChange={(e) => {
							formValidation.otp_4.onChange(e);
							updateSelectedForm("otp_4", e.target.value);
						}}
						type="text"
						name="otp_4"
						id="otp_4"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_4}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
					<input
						{...formValidation.otp_5}
						onChange={(e) => {
							formValidation.otp_5.onChange(e);
							updateSelectedForm("otp_5", e.target.value);
						}}
						type="text"
						name="otp_5"
						id="otp_5"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_5}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
					<input
						{...formValidation.otp_6}
						onChange={(e) => {
							formValidation.otp_6.onChange(e);
							updateSelectedForm("otp_6", e.target.value);
						}}
						type="text"
						name="otp_6"
						id="otp_6"
						maxLength="1"
						autoComplete="off"
						value={formData.otp_6}
						className={style.input}
						onKeyUp={focusOnNextField}
					/>
				</div>
				{authError && (
					<div className="showerrorotp">
						<div className="invalidotp">
							<span className="erricn">
								<CustomImage
									src={errorIconNew}
									alt="error"
									width="12"
									height="12"
								/>
							</span>
							&nbsp;{authError}
						</div>
						{/* <div className="tryagain" onClick={handleTryAgain}>
							Try Again
						</div> */}
					</div>
				)}
				<div>
					<button
						type="button"
						className="commonBtn cancelbtn borderBtn"
						onClick={goBack}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="commonBtn submitbtn dark"
						disabled={isLoading}
					>
						{isLoading ? "Verifying" : "Verify OTP"}
					</button>
				</div>
			</form>
			<div className={style.otpbtmtx}>
				if you did not receive the OTP, check the username entered.
			</div>
		</>
	);
}
