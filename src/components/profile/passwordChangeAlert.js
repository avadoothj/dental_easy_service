import CustomImage from "@/common/customImage";
import commonStyle from "@/css/common/common.module.scss";
import { closeIcon, securityAlert } from "@/utils/imagesPicker";

export default function PasswordChangeAlert({ handleClose, remainDays }) {
	return (
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
				<div className={commonStyle.headerterms}>Security Alert</div>
				<div className={commonStyle.walletimg}>
					<CustomImage
						src={securityAlert}
						alt="password"
						width="167"
						height="167"
					/>
				</div>
				<div className={commonStyle.messcon}>
					Your password will expire in <span>{remainDays}</span> days.
					<br />
					Please change your password.
				</div>
				<div className={commonStyle.chpassbtn}>
					<button
						className="commonBtn dark loginbtn"
						onClick={handleClose}
					>
						Ok
					</button>
				</div>
			</div>
		</div>
	);
}
