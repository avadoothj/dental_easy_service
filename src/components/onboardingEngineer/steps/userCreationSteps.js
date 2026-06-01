"use client";
import commonStyle from "@/css/common/common.module.scss";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { addUserCreationFieldEngineer } from "@/controllers/onboarding";
export default function UserCreationStep({ onboardingData, onNext, onBack }) {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",

		defaultValues: {
			username: "",

			password: "",

			assignServiceHead: "",
		},
	});

	console.log("onboardingData :", onboardingData);
	const onSubmit = async (data) => {
		const payload = {
			...data,
			onboardingId: onboardingData?.onboardingId,
			fieldEngineerId: onboardingData?.fieldEngineerId,
		};

		const response = await addUserCreationFieldEngineer(payload);

		if (response.success) {
			onNext({
				userCreationData: response.data,
			});
		}
	};

	useEffect(() => {
		if (!onboardingData?.userCreationData) return;
		const usercreation = onboardingData.userCreationData;
		console.log("usercreation :", usercreation);
		reset({
			username: usercreation.username || "",
			password: usercreation.password || "",
			assignServiceHead: usercreation.assign_service_head || "",
		});
	}, [onboardingData, reset]);

	return (
		<div className="pt-0">
			<Form onSubmit={handleSubmit(onSubmit)}>
				<h3 className={commonStyle.mediumHeading}>User Creation</h3>
				<div className="row mb-3">
					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								User Name
								<sup>*</sup>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter user name"
								{...register("username", {
									required: "Username is required",
								})}
							/>

							{errors.username && (
								<p className="errorMsg">{errors.username.message}</p>
							)}
						</div>
					</div>

					{/* PASSWORD */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Password
								<sup>*</sup>
							</label>

							<div className="password-wrap">
								<input
									type={showPassword ? "text" : "password"}
									className="form-control"
									placeholder="Enter password"
									{...register("password", {
										required: "Password is required",

										minLength: {
											value: 8,

											message: "Minimum 8 characters required",
										},
									})}
								/>

								<i
									className={`toggle-password fa ${
										showPassword ? "fa-eye" : "fa-eye-slash"
									}`}
									onClick={() => setShowPassword(!showPassword)}
									style={{
										cursor: "pointer",
									}}
								></i>
							</div>

							<span className="smalllighttext">
								Password should contain at least 8 characters
							</span>

							{errors.password && (
								<p className="errorMsg">{errors.password.message}</p>
							)}
						</div>
					</div>

					{/* SERVICE HEAD */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Assign Service Head
								<sup>*</sup>
							</label>

							<select
								className="form-select"
								{...register("assignServiceHead", {
									required: "Service Head is required",
								})}
							>
								<option value="">Select Service Head</option>

								<option value="1">Rajesh Kumar - Ghansoli</option>

								<option value="2">Pratik Tiwari - Vashi</option>

								<option value="3">Dinesh Sharma - Thane</option>
							</select>

							{errors.assignServiceHead && (
								<p className="errorMsg">
									{errors.assignServiceHead.message}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className={commonStyle.footerButton}>
					<div className={commonStyle.right}>
						<button
							type="button"
							className={commonStyle.commonBtn + " " + commonStyle.link}
							onClick={onBack}
						>
							Back
						</button>

						<button
							type="submit"
							className={commonStyle.commonBtn + " " + commonStyle.fill}
						>
							Save & Next
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
}
