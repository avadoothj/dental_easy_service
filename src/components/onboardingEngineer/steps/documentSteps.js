"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { add } from "date-fns";
import { addDocumentFieldEngineer } from "@/controllers/onboarding";

export default function DocumentStep({
	onValidityChange,
	registerSubmit,
	onNext,

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
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			defaultValues: onboardingData.documentData,
			passportPhoto: null,
			identityProof: null,
			addressProof: null,
		},
	});

	console.log("userData  INSIDE DOC :", userData);
	const onSubmit = async (data) => {
		console.log(data.passportPhoto[0]);
		console.log(data.identityProof[0]);
		console.log(data.addressProof[0]);
		const formData = new FormData();

		formData.append("passportPhoto", data.passportPhoto[0]);
		formData.append("identityProof", data.identityProof[0]);
		formData.append("addressProof", data.addressProof[0]);
		const response = addDocumentFieldEngineer(formData);
		onNext({
			documentData: data,
		});
		return;

		await onNext(formData);
	};
	console.log("DocumentStep - currentStep:", currentStep);
	return (
		<>
			<div
				className="pt-0"
				id="nav-profile"
				role="tabpanel"
				aria-labelledby="nav-profile-tab"
			>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<div className="card">
						<div className="cardHeader">
							<h3 className="card-title">Document Verification</h3>
						</div>
						<div className="card-body p-0">
							<ul className="upload-list">
								<li>
									<div className="document-label">
										<div className="form-group">
											<label className="form-label">
												Upload Passport-size Photo<sup>*</sup>
											</label>
											<span className="smalllighttext">
												Please upload a passport-size photograph with a
												white background.{" "}
											</span>
										</div>
									</div>
									<div className="document-upload">
										<label className="upload-files">
											<input
												type="file"
												className="form-control"
												accept=".jpg,.jpeg,.png,.pdf"
												{...register("passportPhoto", {
													required: "Passport photo is required",
												})}
											/>
											<span className="download-icon"></span>
											<span className="browse-text">
												Drag your file(s) or <a href="#">browse</a>
											</span>
											<span className="file-note">
												The file size must be within 50 kb. Only support
												.jpg, .png and pdf files
											</span>
										</label>
										<div className="d-flex align-items-center gap-2">
											<div className="upload-files-names">
												<div className="d-flex gap-1">
													<span className="files"></span>
													<div className="d-flex align-items-center gap-2">
														<span className="file-name">
															office_12345.jpg
														</span>
													</div>
												</div>
												<span className="close"></span>
											</div>
										</div>
									</div>
								</li>
								<li>
									<div className="document-label">
										<div className="form-group">
											<label className="form-label">
												Proof of Identity<sup>*</sup>
											</label>
											<span className="smalllighttext">
												(Upload Aadhar card, PAN card, Passport, voter Id )
											</span>
										</div>
									</div>
									<div className="document-upload">
										<label className="upload-files">
											<input
												type="file"
												className="form-control"
												accept=".jpg,.jpeg,.png,.pdf"
												{...register("identityProof", {
													required: "Identity proof is required",
												})}
											/>
											<span className="download-icon"></span>
											<span className="browse-text">
												Drag your file(s) or <a href="#">browse</a>
											</span>
											<span className="file-note">
												The file size must be within 200 kb. Only support
												.jpg, .png and pdf files
											</span>
										</label>
										{/* <!-- <div className="note">
                                                        <span>Please upload a passport-size photograph with a white background. The file size must be within 50 kb.</span>
                                                    </div> --> */}
									</div>
								</li>
								<li>
									<div className="document-label">
										<div className="form-group">
											<label className="form-label">
												Proof Of Address <sup>*</sup>
											</label>
											<span className="smalllighttext">
												(Upload utility proof eg. Aadhar card, Light bill,
												Driving license)
											</span>
										</div>
									</div>
									<div className="document-upload">
										<label className="upload-files">
											<input
												type="file"
												className="form-control"
												accept=".jpg,.jpeg,.png,.pdf"
												{...register("addressProof", {
													required: "Address proof is required",
												})}
											/>
											<span className="download-icon"></span>
											<span className="browse-text">
												Drag your file(s) or <a href="#">browse</a>
											</span>
											<span className="file-note">
												The file size must be within 200 kb. Only support
												.jpg, .png and pdf files
											</span>
										</label>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div className="btn-wrap d-flex justify-content-end">
						<button
							type="button"
							className="btn btnOutline"
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
