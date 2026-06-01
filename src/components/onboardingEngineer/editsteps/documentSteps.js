import commonStyle from "@/css/common/common.module.scss";

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
	console.log("DocumentStep - currentStep:", currentStep);
	return (
		<>
			<div
				className="pt-0"
				id="nav-profile"
				role="tabpanel"
				aria-labelledby="nav-profile-tab"
			>
				<div className="card">
					<h3 className={commonStyle.mediumHeading}>Document Verification</h3>
					<div className="card-body p-0">
						<ul className="upload-list">
							<li>
								<div className="document-label">
									<div className="form-group">
										<label className="form-label">
											Upload Passport-size Photo<sup>*</sup>
										</label>
										<span className="smalllighttext">
											Please upload a passport-size photograph with a white
											background.{" "}
										</span>
									</div>
								</div>
								<div className="document-upload">
									<label className="upload-files">
										<input
											type="file"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter your full name"
											aria-describedby="emailHelp"
										/>
										<span className="download-icon"></span>
										<span className="browse-text">
											Drag your file(s) or <a href="#">browse</a>
										</span>
										<span className="file-note">
											The file size must be within 50 kb. Only support .jpg,
											.png and pdf files
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
											id="exampleInputEmail1"
											placeholder="Enter your full name"
											aria-describedby="emailHelp"
										/>
										<span className="download-icon"></span>
										<span className="browse-text">
											Drag your file(s) or <a href="#">browse</a>
										</span>
										<span className="file-note">
											The file size must be within 200 kb. Only support .jpg,
											.png and pdf files
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
											id="exampleInputEmail1"
											placeholder="Enter your full name"
											aria-describedby="emailHelp"
										/>
										<span className="download-icon"></span>
										<span className="browse-text">
											Drag your file(s) or <a href="#">browse</a>
										</span>
										<span className="file-note">
											The file size must be within 200 kb. Only support .jpg,
											.png and pdf files
										</span>
									</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className={commonStyle.footerButton}>
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
			</div>
		</>
	);
}
