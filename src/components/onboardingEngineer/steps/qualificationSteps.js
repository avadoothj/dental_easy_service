"use client";

import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import commonStyle from "@/css/common/common.module.scss";
import { addQualificationFieldEngineer, savequalificationDraft } from "@/controllers/onboarding";
import { useEffect } from "react";

export default function QualificationStep({ onboardingData, onNext, onBack }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",

		defaultValues: {
			qualification: "",
			experience: "",
			specificEquipmentExpertise: "",
			technicianType: "",
			uploadtrainingCertificates: "",
			specialCertifications: "",
			servicesCoveragecity: "",
			servicesCoveragearea: "",
		},
	});

	const onSubmit = async (data) => {
		const formData = new FormData();

		formData.append("qualification", data.qualification);
		formData.append("experience", data.experience);
		formData.append("specificEquipmentExpertise", data.specificEquipmentExpertise);
		formData.append("technicianType", data.technicianType);
		formData.append("servicesCoveragecity", data.servicesCoveragecity);
		formData.append("servicesCoveragearea", data.servicesCoveragearea);
		formData.append("onboardingId", onboardingData.onboardingId);
		formData.append("fieldEngineerId", onboardingData.fieldEngineerId);

		if (data.uploadtrainingCertificates?.[0]) {
			formData.append("uploadtrainingCertificates", data.uploadtrainingCertificates[0]);
		}

		if (data.specialCertifications?.[0]) {
			formData.append("specialCertifications", data.specialCertifications[0]);
		}

		const response = await addQualificationFieldEngineer(formData);

		if (response.success) {
			onNext({
				qualificationData: response.data,
			});
		}
	};

	const handleSaveDraft = async (data) => {
		const formData = new FormData();

		formData.append("qualification", data.qualification);
		formData.append("experience", data.experience);
		formData.append("specificEquipmentExpertise", data.specificEquipmentExpertise);
		formData.append("technicianType", data.technicianType);
		formData.append("servicesCoveragecity", data.servicesCoveragecity);
		formData.append("servicesCoveragearea", data.servicesCoveragearea);
		formData.append("onboardingId", onboardingData.onboardingId);
		formData.append("fieldEngineerId", onboardingData.fieldEngineerId);

		if (data.uploadtrainingCertificates?.[0]) {
			formData.append("uploadtrainingCertificates", data.uploadtrainingCertificates[0]);
		}

		if (data.specialCertifications?.[0]) {
			formData.append("specialCertifications", data.specialCertifications[0]);
		}

		const response = await savequalificationDraft(formData);

	};

	useEffect(() => {
		if (!onboardingData?.qualificationData) return;
		const qualification = onboardingData.qualificationData;
		reset({
			qualification: qualification.qualification || "",
			experience: qualification.experience || "",
			specificEquipmentExpertise: qualification.specific_equipment_expertise || "",
			technicianType: qualification.technician_type || "",
			servicesCoveragecity: qualification.services_coverage_city?.split(",") || [],
			servicesCoveragearea: qualification.services_coverage_area?.split(",") || [],
		});
	}, [onboardingData, reset]);

	return (
		<div className="pt-0">
			<Form onSubmit={handleSubmit(onSubmit)}>
					<h3 className={commonStyle.mediumHeading}>Qualification & Technical Skill</h3>
					<div className="row">
						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">Qualification</label>

								<select
									className="form-select"
									{...register("qualification", {
										required: "Qualification is required",
									})}
								>
									<option value="">Select Qualification</option>

									<option value="Biomedical">Biomedical</option>

									<option value="Mechanical Electrical">
										Mechanical Electrical
									</option>

									<option value="Dental equipment technology">
										Dental equipment technology
									</option>
								</select>

								{errors.qualification && (
									<p className="errorMsg">{errors.qualification.message}</p>
								)}
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">Year Of experience</label>

								<input
									type="text"
									className="form-control"
									placeholder="Enter education"
									{...register("experience", {
										required: "Education is required",
									})}
								/>

								{errors.experience && (
									<p className="errorMsg">{errors.experience.message}</p>
								)}
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">
									Specific equipment experties
								</label>

								<select
									className="form-select"
									{...register("specificEquipmentExpertise", {
										required: "Specific equipment experties is required",
									})}
								>
									<option value="">Select equipment experties</option>
									<option value="dentalChairs">
										Dental chairs and delivery systems
									</option>
									<option value="airCompressors">
										Air compressors and vacuum pumps
									</option>
									<option value="highSpeedLowSpeedHandpieces">
										High-speed and low-speed handpieces
									</option>
									<option value="electrichandpiecemotors">
										Electric handpiece motors
									</option>
									<option value="ledCuringLights">LED curing lights</option>
									<option value="dentaloperatingmicroscopes">
										Dental operating microscopes
									</option>
									<option value="portabledentalunits">
										Portable dental units
									</option>
								</select>

								{errors.specificEquipmentExpertise && (
									<p className="errorMsg">
										{errors.specificEquipmentExpertise.message}
									</p>
								)}
							</div>
						</div>
						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">Technician Type</label>

								<select
									className="form-select"
									{...register("technicianType", {
										required: "Technician Type is required",
									})}
								>
									<option value="">Select Technician Type</option>
									<option value="abc">ABC</option>
									<option value="xyz">XYZ</option>
									<option value="pqr">PQR</option>
								</select>

								{errors.technicianType && (
									<p className="errorMsg">{errors.technicianType.message}</p>
								)}
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">
									Upload training Certificates{" "}
								</label>
								<input
									type="file"
									className="form-control"
									id="exampleInputEmail1"
									placeholder="Enter your year of experience"
									aria-describedby="emailHelp"
									{...register("uploadtrainingCertificates")}
								/>
							</div>
						</div>

						<div className="col-md-4">
							<div className="form-group">
								<label className="form-label">Special Certifications </label>
								<input
									type="file"
									className="form-control"
									id="exampleInputEmail1"
									placeholder="Enter year of experience"
									aria-describedby="emailHelp"
									{...register("specialCertifications")}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<h6 className="mt-1 small-title mb-0">Services coverage</h6>
								<span className="smalllighttext mb-2 d-block">
									Define the technician’s working locations and how far they
									can travel for service requests.
								</span>
							</div>

							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Select City<sup>*</sup>
									</label>
									<select
										id="choices-multiple-remove-button"
										className="form-control"
										placeholder="Select City"
										multiple
										{...register("servicesCoveragecity", {
											required: "City is required",
										})}
									>
										<option
											value="Mumbai"
											// onClick="filterSelection('Author')"
										>
											Mumbai
										</option>
										<option value="Pune">Pune</option>
										<option value="Nagpur">Nagpur</option>
										<option value="Thane">Thane</option>
										<option value="Nashik">Nashik</option>
										<option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
										<option value="Vasai-Virar">Vasai-Virar</option>
										<option value="Navi Mumbai">Navi Mumbai</option>
										<option value="Solapur">Solapur</option>
										<option value="Amravati">Amravati</option>
										<option value="Kolhapur">Kolhapur</option>
										<option value="Sangli">Sangli</option>
										<option value="Nanded">Nanded </option>
									</select>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Select Area<sup>*</sup>
									</label>
									<select
										id="choices-multiple-remove-button"
										className="form-control"
										placeholder="Select Area"
										multiple
										{...register("servicesCoveragearea", {
											required: "Area is required",
										})}
									>
										<option
											value="Mumbai"
											// onclick="filterSelection('Author')"
										>
											Bandra
										</option>
										<option value="Pune">Andheri</option>
										<option value="Nagpur">Borivali</option>
										<option value="Thane">Colaba</option>
										<option value="Nashik">Nashik</option>
										<option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
										<option value="Vasai-Virar">Vasai-Virar</option>
										<option value="Navi Mumbai">Navi Mumbai</option>
										<option value="Solapur">Solapur</option>
										<option value="Amravati">Amravati</option>
										<option value="Kolhapur">Kolhapur</option>
										<option value="Sangli">Sangli</option>
										<option value="Nanded">Nanded </option>
									</select>
								</div>
							</div>
						</div>
					</div>

				<div className={commonStyle.footerButton}>
					<div className={commonStyle.right}>
						<button
							type="button"
							className={commonStyle.commonBtn + " " + commonStyle.link}
							id="personalinfo"
							onClick={handleSubmit(handleSaveDraft)}
						>
							Save as Draft
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
