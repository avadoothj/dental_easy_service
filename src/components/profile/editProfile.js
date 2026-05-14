import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import style from "@/css/profile/myProfile.module.scss";
import { formatDate, getConstant } from "@/utils/utils";
import { editProfileValidation } from "@/utils/formValidation";
import { editUserProfile } from "@/controllers/profile";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";

export default function EditProfile({ profileData, handleToggleClick }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { showAlert } = useContext(AppContext);

	const defaultFormData = {
		display_name: profileData.display_name,
		mobile: profileData.user_mobile,
		email: profileData.user_email,
	};

	const formValidation = {
		display_name: register("display_name", editProfileValidation.display_name),
		mobile: register("mobile", editProfileValidation.mobile),
		email: register("email", editProfileValidation.email),
	};

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		setFormUpdate(true);
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [formUpdate, setFormUpdate] = useState(false);

	const handleFormSubmit = async () => {
		setIsLoading(true);

		const response = await editUserProfile(formData);

		if (response.success) {
			showAlert(messages.PROFILE_UPDATE_SUCCESS, 1);
			handleToggleClick();
		} else {
			showAlert(response.msg);
			setIsLoading(false);
		}
	};
	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<div className={style.detailRow1}>
				<div className={`${style.detailcol} ${style.detailColInput}`}>
					<label>Display Name</label>
					<div className={style.detailInputWrap}>
						<input
							{...formValidation.display_name}
							type="text"
							value={formData.display_name}
							id="display_name"
							name="display_name"
							placeholder="Enter Display Name"
							onChange={(e) => {
								formValidation.display_name.onChange(e);
								updateSelectedForm("display_name", e.target.value);
							}}
							maxLength={inputMaxLength}
						/>
						{errors?.display_name && (
							<span className={style.logerror}>{errors.display_name?.message}</span>
						)}
					</div>
				</div>
				<div className={style.detailcol}>
					<label>Username/ID</label>
					<div className={style.detailText}>{profileData.username}</div>
				</div>

				<div className={style.detailcol}>
					<label>Last Active</label>
					<div className={style.detailText}>{formatDate(profileData.last_login, 2)}</div>
				</div>

				<div className={`${style.detailcol} ${style.detailColInput}`}>
					<label>Mobile Number</label>
					<div className={style.detailInputWrap}>
						<input
							{...formValidation.mobile}
							type="text"
							value={formData.mobile}
							id="mobile"
							name="mobile"
							maxLength="10"
							placeholder="Enter Mobile Number"
							onChange={(e) => {
								formValidation.mobile.onChange(e);
								updateSelectedForm("mobile", e.target.value);
							}}
						/>
						{errors?.mobile && (
							<span className={style.logerror}>{errors.mobile?.message}</span>
						)}
					</div>
				</div>
				<div className={style.detailcol}>
					<label>User Role</label>
					<div className={style.detailText}>{profileData.role}</div>
				</div>
				<div className={style.detailcol}>
					<label>Added On</label>
					<div className={style.detailText}>{formatDate(profileData.added_on)}</div>
				</div>
				<div className={`${style.detailcol} ${style.detailColInput}`}>
					<label>Email ID</label>
					<div className={style.detailInputWrap}>
						<input
							{...formValidation.email}
							type="text"
							value={formData.email}
							id="email"
							name="email"
							placeholder="Enter Email ID"
							onChange={(e) => {
								formValidation.email.onChange(e);
								updateSelectedForm("email", e.target.value);
							}}
							maxLength={inputMaxLength}
						/>
						{errors?.email && (
							<span className={style.logerror}>{errors.email?.message}</span>
						)}
					</div>
				</div>
			</div>
			<div className={style.editDetailWrap}>
				<a href="#"></a>
				<div className={style.btnWrapper}>
					<button
						type="button"
						className="commonBtn borderBtn"
						onClick={handleToggleClick}
						disabled={isLoading}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="commonBtn dark"
						disabled={isLoading || !formUpdate}
					>
						{isLoading ? "Saving" : "Save"}
					</button>
				</div>
			</div>
		</form>
	);
}
