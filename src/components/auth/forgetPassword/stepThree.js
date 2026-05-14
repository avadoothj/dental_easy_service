"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/css/auth/login.module.scss";
import { getConstant } from "@/utils/utils";
import { forgetPasswordStepThree } from "@/utils/formValidation";
import ErrorMessage from "@/common/errorMessage";
import { setNewPassword } from "@/controllers/forgetPassword";
import messages from "@/utils/messages";
import commonStyle from "@/css/common/common.module.scss";

export default function StepThree({ nextStep, username, verificationToken }) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const defaultFormData = {
		new_password: "",
		confirm_password: "",
	};

	const formValidation = {
		new_password: register("new_password", forgetPasswordStepThree.new_password),
		confirm_password: register("confirm_password", {
			...forgetPasswordStepThree.confirm_password,
			validate: (value) =>
				value == watch("new_password", "") || messages.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH,
		}),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [authError, setAuthError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword1, setShowPassword1] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleFormSubmit = async () => {
		setAuthError("");
		setIsLoading(true);

		const payload = {
			username: username,
			password: formData.new_password,
			token: verificationToken,
		};

		const response = await setNewPassword(payload);

		if (response.success) {
			nextStep();
		} else {
			setIsLoading(false);
			setAuthError(response.msg);
		}
	};

	const inputMaxLength = getConstant("MAXLENGTH_NAME");

	return (
		<>
			<h2>Change Password</h2>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.inpulable}>
					<input
						{...formValidation.new_password}
						onChange={(e) => {
							formValidation.new_password.onChange(e);
							updateSelectedForm("new_password", e.target.value);
						}}
						type={showPassword1 ? "text" : "password"}
						name="new_password"
						id="new_password"
						className={style.userinput}
						placeholder="New Password"
						maxLength={inputMaxLength}
					/>
					<span
						onClick={() => setShowPassword1(!showPassword1)}
						className={showPassword1 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.new_password && (
						<span className={commonStyle.logerror}>{errors.new_password?.message}</span>
					)}
				</div>
				<div className={style.inpulable}>
					<input
						{...formValidation.confirm_password}
						onChange={(e) => {
							formValidation.confirm_password.onChange(e);
							updateSelectedForm("confirm_password", e.target.value);
						}}
						type={showPassword2 ? "text" : "password"}
						name="confirm_password"
						id="confirm_password"
						className={style.userinput}
						placeholder="Re-Enter New Password"
					/>
					<span
						onClick={() => setShowPassword2(!showPassword2)}
						className={showPassword2 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.confirm_password && (
						<span className={commonStyle.logerror}>
							{errors.confirm_password?.message}
						</span>
					)}
				</div>
				<ErrorMessage message={authError} />
				<div className={style.cpasstxt}>
					Enter Strong Password In Order To Protect Your Account
				</div>
				<button
					type="submit"
					className="commonBtn loginbtn dark"
					disabled={isLoading}
				>
					{isLoading ? getConstant("LOADING_TEXT") : "Submit"}
				</button>
			</form>
		</>
	);
}
