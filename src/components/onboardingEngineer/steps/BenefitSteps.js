"use client";
import { useFieldArray, useForm } from "react-hook-form";
import commonStyle from "@/css/common/common.module.scss";
import Form from "react-bootstrap/Form";
import { addBenefitFieldEngineer } from "@/controllers/onboarding";
import { useEffect } from "react";

export default function BenefitStep({ onboardingData, onNext, onBack }) {
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",

		defaultValues: {
			insurancePlan: "",

			insuranceType: "",

			coverageAmount: "",

			policyNumber: "",

			familyMembers: [
				{
					fullName: "",

					relationship: "",

					age: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,

		name: "familyMembers",
	});

	const onSubmit = async (data) => {
		const payload = {
			...data,

			onboardingId: onboardingData?.onboardingId,

			fieldEngineerId: onboardingData?.fieldEngineerId,
		};
		console.log("payload--- :", payload);
		const response = await addBenefitFieldEngineer(payload);

		if (response.success) {
			onNext({
				benefitData: response.data,
			});
		}
	};

	useEffect(() => {
		if (!onboardingData?.benefitData) return;
		const benefitData = onboardingData.benefitData;
		console.log("benefitData :", benefitData);
		reset({
			insurancePlan: benefitData.insurance_plan || "",
			insuranceType: benefitData.insurance_type || "",
			coverageAmount: benefitData.coverage_amount || "",
			policyNumber: benefitData.policy_number || "",	
			familyMembers: benefitData.family_members || "",
		});
	}, [onboardingData, reset]);

	return (
		<div className="pt-0">
			<Form onSubmit={handleSubmit(onSubmit)}>
				<h3 className={commonStyle.mediumHeading}>Benefits</h3>
				<span className="d-block mb-2">Select the benefits the company will provide to the technician</span>
				{/* BENEFITS */}

				<div className="row align-items-end">
					<div className="col-md-6">
						<div className="form-group">
							<label className="form-label">Insurance Plan</label>

							<select
								className="form-select"
								{...register("insurancePlan", {
									required: "Insurance plan is required",
								})}
							>
								<option value="">Select Insurance Plan</option>

								<option value="Basic Health Insurance">
									Basic Health Insurance
								</option>

								<option value="Standard Health Insurance">
									Standard Health Insurance
								</option>

								<option value="Premium Health Insurance">
									Premium Health Insurance
								</option>
							</select>

							{errors.insurancePlan && (
								<p className="errorMsg">{errors.insurancePlan.message}</p>
							)}
						</div>
					</div>

					{/* INSURANCE TYPE */}

					<div className="col-md-6">
						<div className="form-group">
							<label className="form-label">Type of Insurance</label>

							<select
								className="form-select"
								{...register("insuranceType", {
									required: "Insurance type is required",
								})}
							>
								<option value="">Select Type</option>

								<option value="Accident Insurance">
									Accident Insurance
								</option>

								<option value="Life Insurance">Life Insurance</option>
							</select>

							{errors.insuranceType && (
								<p className="errorMsg">{errors.insuranceType.message}</p>
							)}
						</div>
					</div>

					{/* COVERAGE */}

					<div className="col-md-6">
						<div className="form-group">
							<label className="form-label">Coverage Amount</label>

							<input
								type="text"
								className="form-control"
								placeholder="Enter coverage amount"
								{...register("coverageAmount", {
									required: "Coverage amount is required",
								})}
							/>

							{errors.coverageAmount && (
								<p className="errorMsg">{errors.coverageAmount.message}</p>
							)}
						</div>
					</div>

					{/* POLICY */}

					<div className="col-md-6">
						<div className="form-group">
							<label className="form-label">Policy Number</label>

							<input
								type="text"
								className="form-control"
								placeholder="INS-2025-001"
								{...register("policyNumber", {
									required: "Policy number is required",
								})}
							/>

							{errors.policyNumber && (
								<p className="errorMsg">{errors.policyNumber.message}</p>
							)}
						</div>
					</div>
				</div>

				{/* FAMILY DETAILS */}
				<div className="p-4 bg-light rounded-4">
				<div className="d-flex gap-2">
				<h3 className={commonStyle.mediumHeading + " " + "mb-0"}>Family Details</h3>
				<button type="button" className="btn btn-sm btn-primary"
					onClick={() =>
						append({
							fullName: "",

							relationship: "",

							age: "",
						})
					}
				>Add New Member</button></div>
				<ul className="member-list">
					{fields.map((field, index) => (
						<li key={field.id} className="d-flex flex-grow-1 gap-3">
							<div className="d-flex flex-grow-1 gap-3">
								{/* NAME */}

								<div className="form-group flex-grow-1 mb-0">
									<label className="form-label">Full Name</label>

									<input
										type="text"
										className="form-control"
										placeholder="Enter full name"
										{...register(`familyMembers.${index}.fullName`)}
									/>
								</div>

								{/* RELATIONSHIP */}

								<div className="form-group flex-grow-1 mb-0">
									<label className="form-label">Relationship</label>

									<select
										className="form-select"
										{...register(`familyMembers.${index}.relationship`)}
									>
										<option value="">Select</option>

										<option value="Wife">Wife</option>

										<option value="Son">Son</option>

										<option value="Daughter">Daughter</option>

										<option value="Father">Father</option>

										<option value="Mother">Mother</option>
									</select>
								</div>

								{/* AGE */}

								<div className="form-group flex-grow-1 mb-0">
									<label className="form-label">Age</label>

									<input
										type="number"
										className="form-control"
										placeholder="Enter age"
										{...register(`familyMembers.${index}.age`)}
									/>
								</div>
							</div>

							<div>
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => remove(index)}
								>
									Remove
								</button>
							</div>
						</li>
					))}
				</ul>
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
