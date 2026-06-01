"use client";

import { useForm } from "react-hook-form";
import commonStyle from "@/css/common/common.module.scss";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";

import { addBankDetailFieldEngineer } from "@/controllers/onboarding";

export default function BankDetailStep({ onboardingData, onNext, onBack }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",

		defaultValues: {
			bankName: "",
			accountHolderName: "",
			accountType: "",
			accountNumber: "",
			ifscCode: "",
			branchName: "",
		},
	});

	const onSubmit = async (data) => {
		const payload = {
			...data,

			onboardingId: onboardingData?.onboardingId,

			fieldEngineerId: onboardingData?.fieldEngineerId,
		};

		const response = await addBankDetailFieldEngineer(payload);

		if (response.success) {
			onNext({
				bankData: response.data,
			});
		}
	};

	console.log('onboardingData :', onboardingData);
	useEffect(() => {
		if (!onboardingData?.bankData) return;
		const bankData = onboardingData.bankData;
		reset({
			bankName: bankData.bank_name || "",
			accountHolderName: bankData.account_holder_name || "",
			accountType: bankData.account_type || "",
			accountNumber: bankData.account_number || "",
			ifscCode: bankData.ifsc_code || "",	
			branchName: bankData.branch_name || "",

		});
	}, [onboardingData, reset]);

	return (
		<div className="pt-0">
			<Form onSubmit={handleSubmit(onSubmit)}>
				<h3 className={commonStyle.mediumHeading}>Bank Details</h3>
				<div className="row mb-3">
					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Bank Name
								<sup>*</sup>
							</label>

							<select
								className="form-select"
								{...register("bankName", {
									required: "Bank name is required",
								})}
							>
								<option value="">Select Bank</option>

								<option value="State Bank of India">
									State Bank of India (SBI)
								</option>

								<option value="Bank of Baroda">Bank of Baroda</option>

								<option value="Punjab National Bank">
									Punjab National Bank
								</option>

								<option value="Canara Bank">Canara Bank</option>
							</select>

							{errors.bankName && (
								<p className="errorMsg">{errors.bankName.message}</p>
							)}
						</div>
					</div>

					{/* ACCOUNT HOLDER */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Account Holder Name
								<sup>*</sup>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter account holder name"
								{...register("accountHolderName", {
									required: "Account holder name is required",
								})}
							/>

							{errors.accountHolderName && (
								<p className="errorMsg">
									{errors.accountHolderName.message}
								</p>
							)}
						</div>
					</div>

					{/* ACCOUNT TYPE */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Account Type
								<sup>*</sup>
							</label>

							<select
								className="form-select"
								{...register("accountType", {
									required: "Account type is required",
								})}
							>
								<option value="">Select Account Type</option>

								<option value="Savings Account">Savings Account</option>

								<option value="Current Account">Current Account</option>

								<option value="Salary Account">Salary Account</option>
							</select>

							{errors.accountType && (
								<p className="errorMsg">{errors.accountType.message}</p>
							)}
						</div>
					</div>

					{/* ACCOUNT NUMBER */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Account Number
								<sup>*</sup>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter account number"
								{...register("accountNumber", {
									required: "Account number is required",
								})}
							/>

							{errors.accountNumber && (
								<p className="errorMsg">{errors.accountNumber.message}</p>
							)}
						</div>
					</div>

					{/* IFSC */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								IFSC Code
								<sup>*</sup>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter IFSC code"
								{...register("ifscCode", {
									required: "IFSC code is required",
								})}
							/>

							{errors.ifscCode && (
								<p className="errorMsg">{errors.ifscCode.message}</p>
							)}
						</div>
					</div>

					{/* BRANCH */}

					<div className="col-md-4">
						<div className="form-group">
							<label className="form-label">
								Branch Name
								<sup>*</sup>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter branch name"
								{...register("branchName", {
									required: "Branch name is required",
								})}
							/>

							{errors.branchName && (
								<p className="errorMsg">{errors.branchName.message}</p>
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
