"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import commonStyle from "@/css/common/common.module.scss";
import { add } from "date-fns";
import { addDocumentFieldEngineer, saveDocumentDraft } from "@/controllers/onboarding";

export default function DocumentStep({ onboardingData, onNext, onBack }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			passportPhoto: null,
			identityProof: null,
			addressProof: null,
		},
	});
	const [existingFiles, setExistingFiles] = useState({
		passportPhoto: null,
		identityProof: null,
		addressProof: null,
	});

	const buildFormData = (data, isDraft = false) => {
		const formData = new FormData();

		formData.append("onboardingId", onboardingData.onboardingId);
		formData.append("fieldEngineerId", onboardingData.fieldEngineerId);
		formData.append("isDraft", isDraft);

		if (data.passportPhoto?.[0]) {
			formData.append("passportPhoto", data.passportPhoto[0]);
		}

		if (data.identityProof?.[0]) {
			formData.append("identityProof", data.identityProof[0]);
		}

		if (data.addressProof?.[0]) {
			formData.append("addressProof", data.addressProof[0]);
		}

		return formData;
	};

	const onSubmit = async (data) => {
		const formData = buildFormData(data);

		const response = await addDocumentFieldEngineer(formData, onboardingData.fieldEngineerId);

		if (response.success) {
			setExistingFiles({
				passportPhoto: response.documents?.passport_photo || null,
				identityProof: response.documents?.identity_proof || null,
				addressProof: response.documents?.address_proof || null,
			});

			onNext({
				documentData: response.documents,
			});
		}
	};

	const handleSaveDraft = async (data) => {

		const formData = buildFormData(data);

		const response = await saveDocumentDraft(formData, onboardingData.fieldEngineerId);

		if (response.success) {
			// NEW USER

			if (!onboardingData?.onboardingId) {
				router.replace(`/onboarding-engineer/edit/${response.onboardingId}`);

				return;
			}
		}
	};

	useEffect(() => {
		if (!onboardingData?.documentData) return;

		const passportPhoto = onboardingData.documentData.find(
			(doc) => doc.document_type === "passport_photo",
		);

		const identityProof = onboardingData.documentData.find(
			(doc) => doc.document_type === "identity_proof",
		);

		const addressProof = onboardingData.documentData.find(
			(doc) => doc.document_type === "address_proof",
		);

		setExistingFiles({
			passportPhoto,
			identityProof,
			addressProof,
		});
	}, [onboardingData, reset]);
	return (
		<>
			<div
				className="pt-0"
				id="nav-profile"
				role="tabpanel"
				aria-labelledby="nav-profile-tab"
			>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<h3 className={commonStyle.mediumHeading}>Document Verification</h3>

					{/* <ul className={commonStyle.documentList}>
						<li>
							<div className={commonStyle.documentLabel}>
								<label className="form-label">Upload Passport-size Photo<sup>*</sup></label>
								<small>Please upload a passport-size photograph with a white background.</small>
							</div>
							<div className={commonStyle.documentCopy}>
								<label className={commonStyle.fileUpload}>
									<input type="file" />
									<span className="title">Click to <a href="#!">browse</a> local files</span>
									<small>Supported formats: JPG, JPEG, PNG (Max size: 5MB)</small>
								</label>
							</div>
						</li>
						<li>
							<div className={commonStyle.documentLabel}>
								<label className="form-label">Proof of Identity<sup>*</sup></label>
								<small>Upload Aadhar card, PAN card, Passport, voter Id</small>
							</div>
							<div className={commonStyle.documentCopy}>
								<label className={commonStyle.fileUpload}>
									<input type="file" />
									<span className="title">Click to <a href="#!">browse</a> local files</span>
									<small>Supported formats: JPG, JPEG, PNG (Max size: 5MB)</small>
								</label>
							</div>
						</li>
					</ul> */}
					<ul className={commonStyle.documentList}>
						<li>
							<div className={commonStyle.documentLabel}>
								<label className="form-label">
									Upload Passport-size Photo<sup>*</sup>
								</label>
								<small>Please upload a passport-size photograph with a white background.</small>
							</div>
							<div className={commonStyle.documentCopy}>
								<label className={commonStyle.fileUpload}>
									<input
										type="file"
										className="form-control"
										accept=".jpg,.jpeg,.png,.pdf"
										{...register("passportPhoto", {
											required: "Passport photo is required",
										})}
									/>
									<span className="title">Click to <a href="#!">browse</a> local files</span>
									<small>Supported formats: JPG, JPEG, PNG (Max size: 50KB)</small>
								</label>
								<div className={commonStyle.fileName}>myPhoto_2025.jpg</div>
								<div className="d-flex align-items-center gap-2">
									<div className="upload-files-names">
										<div className="d-flex gap-1">
											<span className="files"></span>
											<div className="d-flex align-items-center gap-2">
												<span className="file-name">
													{existingFiles.passportPhoto
														? existingFiles.passportPhoto
																.fileName
														: "No file uploaded"}
												</span>
											</div>
										</div>
										<span className="close"></span>
									</div>
								</div>
							</div>
						</li>
						<li>
							<div className={commonStyle.documentLabel}>
								<label className="form-label">
									Proof of Identity<sup>*</sup>
								</label>
								<small>Upload Aadhar card, PAN card, Passport, voter Id</small>
							</div>
							<div className={commonStyle.documentCopy}>
								<label className={commonStyle.fileUpload}>
									<input
										type="file"
										className="form-control"
										accept=".jpg,.jpeg,.png,.pdf"
										{...register("identityProof", {
											required: "Identity proof is required",
										})}
									/>
									<span className="title">Click to <a href="#!">browse</a> local files</span>
									<small>Supported formats: JPG, JPEG, PNG (Max size: 200KB)</small>
								</label>
								{/* <!-- <div className="note">
												<span>Please upload a passport-size photograph with a white background. The file size must be within 50 kb.</span>
											</div> --> */}
							</div>
						</li>
						<li>
							<div className={commonStyle.documentLabel}>
								<label className="form-label">
									Proof Of Address <sup>*</sup>
								</label>
								<small>Upload utility proof eg. Aadhar card, Light bill, Driving license</small>
							</div>
							<div className={commonStyle.documentCopy}>
								<label className={commonStyle.fileUpload}>
									<input
										type="file"
										className="form-control"
										accept=".jpg,.jpeg,.png,.pdf"
										{...register("addressProof", {
											required: "Address proof is required",
										})}
									/>
									<span className="title">Click to <a href="#!">browse</a> local files</span>
									<small>Supported formats: JPG, JPEG, PNG (Max size: 200KB)</small>
								</label>
							</div>
						</li>
					</ul>
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
		</>
	);
}
