"use client";
import { useState } from "react";
import { consentAccept } from "@/controllers/terms";
import commonStyle from "@/css/common/common.module.scss";
import { getConstant } from "@/utils/utils";

export default function TermsAndConditions({ consentData, handleClose }) {
	const [accepted, setAccepted] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const downloadConsentFile = async () => {
		window.open(consentData.filePath, "_blank");
	};

	const handleTermsClick = async () => {
		setAccepted(!accepted);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const response = await consentAccept();

		if (response.success) {
			handleClose();
		} else {
			setIsLoading(false);
		}
	};

	return (
		<div className={commonStyle.modelcbody}>
			<div className={commonStyle.headerterms}>Terms & Conditions</div>
			<div
				className={commonStyle.contbody}
				dangerouslySetInnerHTML={{ __html: consentData.data }}
			></div>
			<div className={commonStyle.termfooter}>
				<label className={commonStyle.termagree}>
					<input
						type="checkbox"
						disabled={isLoading}
						onClick={handleTermsClick}
					/>
					<div className={commonStyle.brinput}></div>
					<span>Agree to the terms & conditions</span>
				</label>
				<div className={commonStyle.termbtn}>
					<a
						href="/download-terms"
						target="_blank"
						className="commonBtn borderBtn"
						// onClick={downloadConsentFile}
						// disabled={isLoading}
					>
						Download
					</a>
					<button
						onClick={handleSubmit}
						className="commonBtn dark"
						disabled={accepted || isLoading}
					>
						{isLoading ? getConstant("LOADING_TEXT") : "Yes I agree"}
					</button>
				</div>
			</div>
		</div>
	);
}
