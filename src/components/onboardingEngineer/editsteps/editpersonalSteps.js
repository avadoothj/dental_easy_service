"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { personalStepValidation } from "../../../utils/validations/onboarding";
import OnBoardingFormWrapper from "../onBoardingFormWrapper";
import { addFieldEngineer } from "../../../controllers/onboarding";
export default function PersonalStep({
	onValidityChange,
	registerSubmit,
	onNext,
	userData,
	onBack,
	disableNext,
	isFirst,
	isLast,
	currentStep,
}) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm();

	console.log("just for check render", userData);

	const formValidation = {
		name: register("name", personalStepValidation.name),
		phone: register("phone", personalStepValidation.phone),
		altPhone: register("altPhone", personalStepValidation.altPhone),
		email: register("email", personalStepValidation.email),
		dob: register("dob", personalStepValidation.dob),
		gender: register("gender", personalStepValidation.gender),
		permanentAddress1: register("permanentAddress1", personalStepValidation.permanentAddress1),
		permanentState: register("permanentState", personalStepValidation.permanentState),
		permanentCity: register("permanentCity", personalStepValidation.permanentCity),
		permanentPostalCode: register(
			"permanentPostalCode",
			personalStepValidation.permanentPostalCode,
		),
		currentAddress1: register("currentAddress1", personalStepValidation.currentAddress1),
		currentState: register("currentState", personalStepValidation.currentState),
		currentCity: register("currentCity", personalStepValidation.currentCity),
		currentPostalCode: register("currentPostalCode", personalStepValidation.currentPostalCode),
	};
	const [isLoading, setIsLoading] = useState(false);
	const isSame = watch("isAddressSame");
	const permanent = watch([
		"permanentAddress1",
		"permanentAddress2",
		"permanentCountry",
		"permanentState",
		"permanentCity",
		"permanentPostalCode",
	]);
	useEffect(() => {
		if (!isSame) return;

		setValue("currentAddress1", permanent[0]);
		setValue("currentAddress2", permanent[1]);
		setValue("currentCountry", permanent[2]);
		setValue("currentState", permanent[3]);
		setValue("currentCity", permanent[4]);
		setValue("currentPostalCode", permanent[5]);
	}, [isSame, permanent]);
	const onSubmit = (data) => {
		console.log("Personal Step Data:", data);
		return;
		onNext();
	};

	const handleSaveasDraft = async (data) => {
		console.log("Personal Step Data:", data);
		return;
		setIsLoading(true);
		const response = await addFieldEngineer(data);
		console.log("response :", response);

		// if (response.success) {
		// 	// showAlert(messages.USER_ADD_SUCCESS, 1);
		// 	// router.push("/team");
		// } else {
		// 	setIsLoading(false);
		// 	showAlert(response.msg);
		// }
		return;
		onNext();
	};
	return (
		<>
			<div
				className="pt-0"
				id="nav-home"
				role="tabpanel"
				aria-labelledby="nav-home-tab"
			>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<h3 className={commonStyle.mediumHeading}>Personal Details</h3>
					<div className="card mb-10">
						<div className="card-body p-0">
							<div className="row">
								<div className="col-md-4">
									<div className="form-group">
										<label className="form-label">
											Name <sup>*</sup>
										</label>
										<input
											{...formValidation.name}
											onChange={(e) => {
												formValidation.name.onChange(e);
											}}
											defaultValue={userData.full_name}
											type="text"
											className="form-control"
											id="personalDetailsName"
											placeholder="Enter Full Name"
										/>
										{errors.name && (
											<p className="d-block text-danger">
												{errors.name.message}
											</p>
										)}
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group">
										<label className="form-label">
											Phone No.<sup>*</sup>
										</label>
										<input
											type="number"
											className="form-control"
											id="personalDetailsPhone"
											defaultValue={userData.phone}
											{...formValidation.phone}
											onChange={(e) => {
												formValidation.phone.onChange(e);
											}}
											placeholder="Enter contact number"
											aria-describedby="emailHelp"
										/>
										{errors.phone && (
											<p className="errorMsg">{errors.phone.message}</p>
										)}
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group">
										<label className="form-label">Alternative Phone No.</label>
										<input
											type="number"
											className="form-control"
											id="personalDetailsAltPhone"
											{...formValidation.altPhone}
											defaultValue={userData.alternate_phone}
											onChange={(e) => {
												formValidation.altPhone.onChange(e);
											}}
											placeholder="Enter contact number"
											aria-describedby="emailHelp"
										/>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group">
										<label className="form-label">
											Email Id<sup>*</sup>
										</label>
										<input
											type="email"
											className="form-control"
											id="personalDetailsEmail"
											{...formValidation.email}
											defaultValue={userData.email}
											onChange={(e) => {
												formValidation.email.onChange(e);
											}}
											placeholder="Enter email id"
											aria-describedby="emailHelp"
										/>
										{errors.email && (
											<p className="errorMsg">{errors.email.message}</p>
										)}
									</div>
								</div>

								<div className="col-md-4">
									<div className="form-group mb-0">
										<label className="form-label">
											Date Of Birth<sup>*</sup>
										</label>
										<input
											type="date"
											className="form-control"
											id="personalDetailsDOB"
											{...formValidation.dob}
											onChange={(e) => {
												formValidation.dob.onChange(e);
											}}
											defaultValue={userData.dob?.toISOString().split("T")[0]}
											placeholder="Enter your full name"
											aria-describedby="emailHelp"
										/>
										{errors.dob && (
											<p className="errorMsg">{errors.dob.message}</p>
										)}
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group mb-0">
										<label className="form-label">
											{" "}
											Gender<sup>*</sup>
										</label>
										<select
											className="form-select"
											aria-label="Default select example"
											{...formValidation.gender}
											onChange={(e) => {
												formValidation.gender.onChange(e);
											}}
											defaultValue={userData.gender}
										>
											<option
												value=""
												disabled
											>
												Select Gender
											</option>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
										{errors.gender && (
											<p className="errorMsg">{errors.gender.message}</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="card mb-10">
						<div className="cardHeader">
							<h3 className="card-title">Permanent Address</h3>
						</div>
						<div className="card-body p-0">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">Address Line 1</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter address"
											id="permanentAddress1"
											defaultValue={userData.address_line_1}
											{...formValidation.permanentAddress1}
											onChange={(e) => {
												formValidation.permanentAddress1.onChange(e);
											}}
										/>
										{errors.permanentAddress1 && (
											<p className="errorMsg">
												{errors.permanentAddress1.message}
											</p>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											Address Line 2{" "}
											<span className="light-text">(Optional)</span>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter address"
											id="permanentAddress2"
											defaultValue={userData.address_line_2}
											{...register("permanentAddress2")}
										/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">Country</label>
										<select
											id="permanentCountry"
											{...register("permanentCountry")}
											className="form-select"
											defaultValue={userData.country}
										>
											<option
												value=""
												disabled
											>
												--Select country--
											</option>
											<option value="US">United States</option>
											<option value="CA">Canada</option>
											<option value="GB">United Kingdom</option>
											<option value="AU">Australia</option>
											<option value="IN">India</option>
											<option value="DE">Germany</option>
											<option value="FR">France</option>
											<option value="JP">Japan</option>
											<option value="CN">China</option>
											<option value="BR">Brazil</option>
										</select>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">State</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter state"
											defaultValue={userData.state}
											id="permanentState"
											{...formValidation.permanentState}
											onChange={(e) => {
												formValidation.permanentState.onChange(e);
											}}
										/>
										{errors.permanentState && (
											<p className="errorMsg">
												{errors.permanentState.message}
											</p>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">City</label>
										<input
											type="text"
											className="form-control"
											defaultValue={userData.city}
											placeholder="Enter city"
											id="permanentCity"
											{...formValidation.permanentCity}
											onChange={(e) => {
												formValidation.permanentCity.onChange(e);
											}}
										/>
										{errors.permanentCity && (
											<p className="errorMsg">
												{errors.permanentCity.message}
											</p>
										)}
									</div>
								</div>

								<div className="col-md-6">
									<div className="form-group mb-0">
										<label className="form-label">Postal / ZIP Code</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter postal or ZIP code"
											id="permanentPostalCode"
											defaultValue={userData.postal_code}
											{...formValidation.permanentPostalCode}
											onChange={(e) => {
												formValidation.permanentPostalCode.onChange(e);
											}}
										/>
										{errors.permanentPostalCode && (
											<p className="errorMsg">
												{errors.permanentPostalCode.message}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="card mb-10">
						<div className="cardHeader">
							<h3 className="card-title">Current Address </h3>
						</div>
						<div className="card-body p-0">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											Address Line 1 <sup>*</sup>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter address"
											id="currentAddressOne"
											defaultValue={userData.address_line_1}
											{...formValidation.currentAddress1}
											onChange={(e) => {
												formValidation.currentAddress1.onChange(e);
											}}
											disabled={isSame}
										/>
										{errors.currentAddress1 && (
											<p className="errorMsg">
												{errors.currentAddress1.message}
											</p>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											Address Line 2{" "}
											<span className="light-text">(Optional)</span>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter address"
											defaultValue={userData.address_line_2}
											id="currentAddressTwo"
											{...register("currentAddress2")}
											disabled={isSame}
										/>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">Country</label>
										<select
											id="country"
											name="country"
											className="form-select"
											{...register("currentCountry")}
											defaultValue={userData.country}
											disabled={isSame}
										>
											<option value="">--Select country--</option>
											<option value="US">United States</option>
											<option value="CA">Canada</option>
											<option value="GB">United Kingdom</option>
											<option value="AU">Australia</option>
											<option value="IN">India</option>
											<option value="DE">Germany</option>
											<option value="FR">France</option>
											<option value="JP">Japan</option>
											<option value="CN">China</option>
											<option value="BR">Brazil</option>
										</select>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											State<sup>*</sup>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter state"
											id="currentState"
											defaultValue={userData.state}
											{...formValidation.currentState}
											onChange={(e) => {
												formValidation.currentState.onChange(e);
											}}
											disabled={isSame}
										/>
										{errors.currentState && (
											<p className="errorMsg">
												{errors.currentState.message}
											</p>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											City<sup>*</sup>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter city"
											id="currentCity"
											{...formValidation.currentCity}
											onChange={(e) => {
												formValidation.currentCity.onChange(e);
											}}
											disabled={isSame}
										/>
										{errors.currentCity && (
											<p className="errorMsg">{errors.currentCity.message}</p>
										)}
									</div>
								</div>

								<div className="col-md-6">
									<div className="form-group">
										<label className="form-label">
											Postal / ZIP Code<sup>*</sup>
										</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter postal or ZIP code"
											id="currentPostalCode"
											defaultValue={userData.postal_code}
											{...formValidation.currentPostalCode}
											onChange={(e) => {
												formValidation.currentPostalCode.onChange(e);
											}}
											disabled={isSame}
										/>
										{errors.currentPostalCode && (
											<p className="errorMsg">
												{errors.currentPostalCode.message}
											</p>
										)}
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											defaultChecked={userData.address_type === "permanent"}
											id="currentAddressCheckbox"
											{...register("isAddressSame")}
										/>
										<label
											className="form-check-label"
											htmlFor="currentAddressCheckbox"
										>
											Current Address Same as Permanent Address
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="btn-wrap d-flex justify-content-end">
						<button
							type="button"
							className="btn btnOutline"
							onClick={handleSubmit(handleSaveasDraft)}
							id="personalinfo"
						>
							Save as Draft
						</button>
						<button
							type="button"
							className="btn btnOutline"
							id="personalinfo"
						>
							Preview
						</button>
						<button
							type="submit"
							className="btn btn-fill"
						>
							Save & Next
						</button>
					</div>
				</Form>
			</div>
		</>
	);
}
