import commonStyle from "@/css/common/common.module.scss";
import { closeIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import CommonModal from "@/common/commonModal";
import { getConstant } from "@/utils/utils";

export default function ConfirmationPopup({
	isLoading,
	show,
	heading = "Are you sure?",
	message,
	info = "",
	handleClose,
	confirmAction,
}) {
	return (
		<CommonModal
			show={show}
			handleClose={handleClose}
			className="setStatusModal"
			centered={true}
		>
			<div className={commonStyle.modelcbody}>
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
				<div>
					<div className={commonStyle.headerterms}>{heading}</div>
					<div className={commonStyle.conftext}>
						{message}
						{info != "" && <div className={commonStyle.infoPara}>{info}</div>}
					</div>
					<div className={commonStyle.chpassbtn}>
						<button
							className="commonBtn borderBtn MR15"
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							className="commonBtn dark"
							onClick={confirmAction}
							disabled={isLoading}
						>
							{isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
						</button>
					</div>
				</div>
			</div>
		</CommonModal>
	);
}
