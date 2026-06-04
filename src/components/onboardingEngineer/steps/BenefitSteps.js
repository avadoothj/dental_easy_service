"use client";

import { useFieldArray, useForm } from "react-hook-form";

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
				{/* BENEFITS */}

				<div className="card mb-10">
					<div className="cardHeader">
						<h3 className="card-title">Benefits</h3>
					</div>

					<div className="card-body p-0">
						<span className="smalllighttext">
							Select the benefits the company will provide to the technician
						</span>

						<div className="row align-items-end">
							{/* INSURANCE PLAN */}

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
					</div>
				</div>

				{/* FAMILY DETAILS */}

				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Family Details</h3>

						<button
							type="button"
							className="btn btnPrimary add"
							onClick={() =>
								append({
									fullName: "",

									relationship: "",

									age: "",
								})
							}
						>
							Add New Member
						</button>
					</div>

					<div className="card-body p-0">
						<ul className="member-list">
							{fields.map((field, index) => (
								<li key={field.id}>
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
				</div>

				<div className="btn-wrap d-flex justify-content-end">
					<button
						type="button"
						className="btn btnOutline"
						onClick={onBack}
					>
						Back
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
	);
}
