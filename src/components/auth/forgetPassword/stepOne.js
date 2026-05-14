"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "@/css/auth/login.module.scss";
import { checkUsernameAndSendOtp } from "@/controllers/forgetPassword";
import { forgetPasswordStepOne } from "@/utils/formValidation";
import { getConstant } from "@/utils/utils";
import ErrorMessage from "@/common/errorMessage";
import commonStyle from "@/css/common/common.module.scss";

export default function StepOne({ nextStep, setUsername, setDisplayMessage }) {
	const { push } = useRouter();
	const inputMaxLength = getConstant("MAXLENGTH_NAME");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const defaultFormData = {
		username: "",
	};

	const formValidation = {
		username: register("username", forgetPasswordStepOne.username),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [authError, setAuthError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const goBack = () => {
		push("/login");
	};

	const handleFormSubmit = async () => {
		setAuthError("");
		setIsLoading(true);
		const response = await checkUsernameAndSendOtp(formData);
		console.log("response :", response);

		if (response.success) {
			setUsername(formData.username);
			setDisplayMessage(response.msg);
			nextStep();
		} else {
			setIsLoading(false);
			setAuthError(response.msg);
		}
	};

	return (
		<>
			<h2>Verify User</h2>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.inpulable}>
					<input
						{...formValidation.username}
						onChange={(e) => {
							formValidation.username.onChange(e);
							updateSelectedForm("username", e.target.value);
						}}
						type="text"
						name="username"
						id="username"
						readOnly={isLoading}
						className={style.userinput}
						placeholder="Enter User ID"
						maxLength={inputMaxLength}
					/>
					{errors?.username && (
						<span className={commonStyle.logerror}>{errors.username?.message}</span>
					)}
				</div>
				<ErrorMessage message={authError} />
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
						{isLoading ? "Checking" : "Submit"}
					</button>
				</div>
			</form>
		</>
	);
}
