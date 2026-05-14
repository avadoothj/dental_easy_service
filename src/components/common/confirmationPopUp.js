import React from "react";
import commonStyle from "@/css/common/common.module.scss";
import { closeIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";

export default function ConfirmationPopUp({ title, ConfirmMessage, handleCloseconfirm }) {
	return (
		<div className={commonStyle.modelcbody}>
			<div
				className={commonStyle.closeicn}
				onClick={handleCloseconfirm}
			>
				<CustomImage
					src={closeIcon}
					alt="close"
					width="18"
					height="18"
				/>
			</div>
			<div>
				<div className={commonStyle.headerterms}>{title}</div>
				<div className={commonStyle.conftext}>{ConfirmMessage}</div>
				<div className={commonStyle.chpassbtn}>
					<button className="commonBtn borderBtn MR15">Cancel</button>
					<button className="commonBtn dark">Confirm</button>
				</div>
			</div>
		</div>
	);
}
