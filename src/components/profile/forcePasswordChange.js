import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import { errorIconYellow } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import { forcePasswordChange } from "@/utils/formValidation";
import messages from "@/utils/messages";
import { AppContext } from "@/contextProvider";
import { setForcePassword } from "@/controllers/profile";
import { getConstant } from "@/utils/utils";
import commonStyle from "@/css/common/common.module.scss";

export default function ForcePasswordChange() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const defaultFormData = {
		password: "",
		confirm_password: "",
	};

	const formValidation = {
		password: register("password", forcePasswordChange.password),
		confirm_password: register("confirm_password", {
			...forcePasswordChange.confirm_password,
			validate: (value) =>
				value == watch("password", "") || messages.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH,
		}),
	};

	const { showAlert } = useContext(AppContext);

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword1, setShowPassword1] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleFormSubmit = async (e) => {
		setIsLoading(true);

		const payload = {
			password: formData.password,
		};

		const response = await setForcePassword(payload);
		if (response.success) {
			signOut({
				callbackUrl: "/login",
				redirect: true,
			});
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	return (
		<div className={commonStyle.modelcbody}>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={commonStyle.headerterms}>Update Your Password</div>
				<div className="ifopink">
					<span className="erricnpass">
						<CustomImage
							src={errorIconYellow}
							alt="error"
							width="20"
							height="20"
						/>
					</span>
					<span>
						You need to update you password because this is the first time you are
						signing in, or because your password has expired.
					</span>
				</div>
				<div className={commonStyle.inputParentModal}>
					<input
						{...formValidation.password}
						onChange={(e) => {
							formValidation.password.onChange(e);
							updateSelectedForm("password", e.target.value);
						}}
						type={showPassword1 ? "text" : "password"}
						name="password"
						id="password"
						className="inppassfield"
						placeholder="New Password"
					/>
					<span
						onClick={() => setShowPassword1(!showPassword1)}
						className={showPassword1 ? commonStyle.eyeclose : commonStyle.eyeopen}
					></span>
					{errors?.password && (
						<span className={commonStyle.logerror}>{errors.password?.message}</span>
					)}
				</div>
				<div className={commonStyle.inputParentModal}>
					<input
						{...formValidation.confirm_password}
						onChange={(e) => {
							formValidation.confirm_password.onChange(e);
							updateSelectedForm("confirm_password", e.target.value);
						}}
						type={showPassword2 ? "text" : "password"}
						name="confirm_password"
						id="confirm_password"
						className="inppassfield"
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
