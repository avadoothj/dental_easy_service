import Link from "next/link";
import style from "@/css/isp/isp.module.scss";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/components/common/simpleTooltip";
import CustomImage from "@/components/common/customImage";
import { iInfoIcon, errorIconYellow } from "@/utils/imagesPicker";
import messages from "@/utils/messages";

export default function balanceView({ isp, isAllowBalancePage }) {
	return (
		<div className={style.walletISP}>
			<div className={style.teamgridbox}>
				<div>
					<div className={style.opName}>Current Balance</div>
				</div>
				<div>
					<div className={style.opid}>{formatPrice(isp.available_balance)}</div>
				</div>
			</div>
			{isp.allow_transfer_limit == 1 && (
				<div className={`${style.teamgridbox} ${style.mt15}`}>
					<div>
						<div className={style.opName}>
							Transfer Limit
							<SimpleTooltip text={messages.TRANSFER_AMOUNT_EXPLAIN}>
								<span className={style.infoicn}>
									<CustomImage
										src={iInfoIcon}
										alt="info"
										width="16"
										height="16"
									/>
								</span>
							</SimpleTooltip>
						</div>
					</div>
					<div>
						<div className={style.ispid}>
							{formatPrice(isp.isp_transfer_balance)}
							{isp.isp_transfer_balance <= 0 && (
								<SimpleTooltip text={messages.TRANSFER_AMOUNT_IS_NEGATIVE}>
									<span className={style.infoicn}>
										<CustomImage
											alt="exclamation"
											src={errorIconYellow}
											width="16"
											height="16"
										/>
									</span>
								</SimpleTooltip>
							)}
						</div>
					</div>
				</div>
			)}
			{isAllowBalancePage && (
				<div className={style.btnWrapper}>
					<Link
						href={"/ispWallet?search=" + isp.oper_code}
						className="commonBtn borderBtn"
					>
						Add Balance
					</Link>
				</div>
			)}
		</div>
	);
}
