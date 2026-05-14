import { useContext } from "react";
import copy from "clipboard-copy";
import { AppContext } from "@/contextProvider";
import CustomImage from "@/components/common/customImage";
import commonStyle from "@/css/common/common.module.scss";
import { closeIcon, copyIcon } from "@/utils/imagesPicker";
import messages from "@/utils/messages";

export default function OttStatusCheckModal({ activationInfo, handleClose }) {
	const { showAlert } = useContext(AppContext);

	const heading = {
		active: "Active",
		cancelled: "Cancelled",
		claim: "Ask to claim",
		not_found: "Not found",
		suspended: "Suspended",
	};

	const handleCopyClick = async (textToCopy) => {
		try {
			await copy(textToCopy);
			showAlert("Copied!", 1);
		} catch (error) {
			console.error("Failed to copy text to clipboard", error);
		}
	};

	return (
		<div className={commonStyle.modelcbody}>
			<h4 className={commonStyle.headerOttCheck}>{heading[activationInfo.status] || ""}</h4>
			<div
				className={commonStyle.closeicn}
				onClick={handleClose}
			>
				<CustomImage
					src={closeIcon}
					alt="close"
					width="18"
					height="18"
				/>
			</div>
			<div className={commonStyle.ottActivationBody}>
				<div className={commonStyle.singleLineItem}>
					<span className={commonStyle.infoText}>{activationInfo.msg}</span>
				</div>

				{activationInfo.status == "active" && (
					<div className={commonStyle.singleLineItem2}>
						<span className={`${commonStyle.label} ${commonStyle.link}`}>
							View Link Mobile/Email:&nbsp;
							<a
								href={activationInfo.recovery_link}
								target="_blank"
							>
								{activationInfo.recovery_link}
							</a>
						</span>
					</div>
				)}

				{activationInfo.status == "claim" && (
					<div className={commonStyle.singleLineItem2}>
						<span className={`${commonStyle.label} ${commonStyle.link}`}>
							Activation Link:&nbsp;
							<span
								className={commonStyle.copyicn}
								onClick={() => handleCopyClick(activationInfo.activation_url)}
							>
								Click here to copy link
								<CustomImage
									src={copyIcon}
									alt="copy"
									width="14"
									height="14"
								/>
							</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
