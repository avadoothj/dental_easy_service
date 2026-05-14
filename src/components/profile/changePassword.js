"use client";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { changeProfilePassword } from "@/utils/formValidation";
import messages from "@/utils/messages";
import { getConstant } from "@/utils/utils";
import { setChangePassword } from "@/controllers/profile";
import commonStyle from "@/css/common/common.module.scss";
import CustomImage from "@/common/customImage";
import { AppContext } from "@/contextProvider";
import { closeIcon } from "@/utils/imagesPicker";

export default function ChangePassword({ postSuccess, handleClose }) {
	const inputMaxLength = getConstant("MAXLENGTH_NAME");

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const defaultFormData = {
		current_password: "",
		new_password: "",
		confirm_password: "",
	};

	const formValidation = {
		current_password: register("current_password", changeProfilePassword.current_password),
		new_password: register("new_password", changeProfilePassword.new_password),
		confirm_password: register("confirm_password", {
			...changeProfilePassword.confirm_password,
			validate: (value) =>
				value == watch("new_password", "") || messages.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH,
		}),
	};

	const { showAlert } = useContext(AppContext);

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword1, setShowPassword1] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [showPassword3, setShowPassword3] = useState(false);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleFormSubmit = async (e) => {
		setIsLoading(true);
																																																																																																																																																																																																																																																																																Q
		const payload = {
			password: formData.new_password,
			current_password: formData.current_password,
		};
		console.log("payload :", payload);

		const response = await setChangePassword(payload);

		if (response.success) {
			postSuccess();
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	return (
		<div className={commonStyle.modelcbody}>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div
					className={commonStyle.closeicn}
					onClick={handleClose}
				>
					<CustomImage
						src={closeIcon}
						alt="close"
						width="18"
						height="18"
					/>
				</div>
				<div className={commonStyle.headerterms}>Change Password</div>
				<div className={commonStyle.inputParentModal}>
					<input
						{...formValidation.current_password}
						onChange={(e) => {
							formValidation.current_password.onChange(e);
							updateSelectedForm("current_password", e.target.value);
						}}
						type={showPassword1 ? "text" : "password"}
						name="current_password"
						id="current_password"
						className="inppassfield"
						placeholder="Current Password"
						maxLength={inputMaxLength}
					/>
					<span
						onClick={() => setShowPassword1(!showPassword1)}
						className={showPassword1 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.current_password && (
						<span className={commonStyle.logerror}>
							{errors.current_password?.message}
						</span>
					)}
				</div>
				<div className={commonStyle.inputParentModal}>
					<input
						{...formValidation.new_password}
						onChange={(e) => {
							formValidation.new_password.onChange(e);
							updateSelectedForm("new_password", e.target.value);
						}}
						type={showPassword2 ? "text" : "password"}
						name="new_password"
						id="new_password"
						className="inppassfield"
						placeholder="New Password"
						maxLength={inputMaxLength}
					/>
					<span
						onClick={() => setShowPassword2(!showPassword2)}
						className={showPassword2 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.new_password && (
						<span className={commonStyle.logerror}>{errors.new_password?.message}</span>
					)}
				</div>
				<div className={commonStyle.inputParentModal}>
					<input
						{...formValidation.confirm_password}
						onChange={(e) => {
							formValidation.confirm_password.onChange(e);
							updateSelectedForm("confirm_password", e.target.value);
						}}
						type={showPassword3 ? "text" : "password"}
						name="confirm_password"
						id="confirm_password"
						className="inppassfield"
						placeholder="Re-Enter New Password"
						maxLength={inputMaxLength}
					/>
					<span
						onClick={() => setShowPassword3(!showPassword3)}
						className={showPassword3 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.confirm_password && (
						<span className={commonStyle.logerror}>
							{errors.confirm_password?.message}
						</span>
					)}
				</div>
				<div className={commonStyle.warntxt}>
					Enter Strong Password In Order To Protect Your Account
				</div>
				<div className={commonStyle.chpassbtn}>
					<button
						type="submit"
						className="commonBtn dark loginbtn"
						disabled={isLoading}
					>
						{isLoading ? getConstant("LOADING_TEXT") : "Submit"}
					</button>
				</div>
			</form>
		</div>
	);
}
