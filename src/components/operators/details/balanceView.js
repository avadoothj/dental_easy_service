import React, { useEffect, useState } from "react";
import AddBalanceForOperator from "@/components/operatorWallet/details/addBalanceForOperator";
import CommonModal from "@/components/common/commonModal";
import ConfirmWalletTopup from "@/components/operatorWallet/details/modals/confirmWalletTopup";
import style from "@/css/operator/operator.module.scss";
import NoBalance from "../noBalance";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/components/common/simpleTooltip";
import CustomImage from "@/components/common/customImage";
import { iInfoIcon, errorIconYellow } from "@/utils/imagesPicker";
import messages from "@/utils/messages";

export default function balanceView({ operator, user }) {
	const [showConfirmPop, setShowConfirmPop] = useState(false);
	const [paymentData, setPaymentData] = useState(false);
	const [currentStep, setCurrentStep] = useState(operator?.available_balance > 0 ? 2 : 0);

	const handleToggleConfirmModal = () => {
		setShowConfirmPop(!showConfirmPop);
	};

	const setShowBalance = () => {
		if (operator?.available_balance > 0) {
			setCurrentStep(2);
		} else {
			setCurrentStep(0);
		}
	};

	useEffect(() => {
		setShowBalance();
	}, [operator.available_balance]);

	return (
		<>
			{currentStep == 0 && (
				<NoBalance
					setCurrentStep={setCurrentStep}
					user={user}
				/>
			)}
			{currentStep == 1 && (
				<>
					<AddBalanceForOperator
						item={{ allow_transfer_limit: operator.allow_transfer_limit }}
						ispBalance={operator.isp_transfer_balance}
						operName={operator.oper_name}
						setPaymentData={setPaymentData}
						setWalletHistoryPannel={setShowBalance}
						handleToggleConfirmModal={handleToggleConfirmModal}
					/>

					<CommonModal
						animation={false}
						show={showConfirmPop}
						className="setpricemodel confirmwallet"
						bodyClassName="setpricepad"
						handleClose={handleToggleConfirmModal}
					>
						<ConfirmWalletTopup
							user={operator}
							data={paymentData}
							handleClose={handleToggleConfirmModal}
							setWalletHistoryPannel={setShowBalance}
						/>
					</CommonModal>
				</>
			)}
			{currentStep == 2 && (
				<>
					<div className={style.teammidd}>
						<div className={style.teamgridbox}>
							<div>
								<div className={style.opName}>Operator Balance</div>
							</div>
							<div>
								<div className={style.opid}>
									{formatPrice(operator.available_balance)}
								</div>
							</div>
						</div>
					</div>
					{operator.allow_transfer_limit == 1 && (
						<div className={style.teammidd}>
							<div className={style.teamgridbox}>
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
										{formatPrice(operator.isp_transfer_balance)}
										{operator.isp_transfer_balance <= 0 && (
											<SimpleTooltip
												text={messages.TRANSFER_AMOUNT_IS_NEGATIVE}
											>
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
						</div>
					)}
					<div className={style.btnWrapper}>
						{/* <button
							className="commonBtn borderBtn"
							onClick={(e) => setActiveTab("plans")}
						>
							Back
						</button> */}
						{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
							<button
								id="addBalanceOperator"
								className="commonBtn dark"
								onClick={(e) => setCurrentStep(1)}
							>
								Add Balance
							</button>
						)}
					</div>
				</>
			)}
		</>
	);
}
