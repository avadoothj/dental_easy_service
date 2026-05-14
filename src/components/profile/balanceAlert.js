import CustomImage from "@/common/customImage";
import commonStyle from "@/css/common/common.module.scss";
import { closeIcon, walletImage } from "@/utils/imagesPicker";
import { formatPrice } from "@/utils/utils";

export default function BalanceAlertPopUp({ balance, handleClose }) {
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
				<div className={commonStyle.headerterms}>Minimum Balance Alert</div>
				<div className={commonStyle.walletimg}>
					<CustomImage
						src={walletImage}
						alt="wallet"
						width="167"
						height="187"
					/>
				</div>
				<div className={commonStyle.messcon}>
					Your Current Balance <span>( {formatPrice(balance)} )</span> Is Below Minimum
					Balance. Please Recharge Quickly.
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
