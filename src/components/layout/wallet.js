"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import style from "@/css/common/header.module.scss";
import style2 from "@/css/common/sidebar.module.scss";
import walletStyle from "@/css/wallet/walletModal.module.scss";
import CustomImage from "@/common/customImage";
import {
	sidebarWallet,
	wallet,
	sidebarExclamationIcon,
	sidebarExclamationIcon2,
} from "@/utils/imagesPicker";
import { formatPrice, formatDate, getCookie } from "@/utils/utils";
import CommonModal from "@/common/commonModal";
// import AddBalancePopup from "@/components/payment/addBalancePopup";
import messages from "@/utils/messages";
import SimpleTooltip from "@/components/common/simpleTooltip";

export default function Wallet({ user, balance, handleHamburgerClick, header = true }) {
	const [showModal, setShowModal] = useState(false);
	const [lowBalance, setLowBalance] = useState(false);

	let balanceAlert = balance.success && balance.showBalance && balance.showAlert ? true : false;
	const showAddButton = user.user_type == "isp" ? (user.super_isp_id == 0 ? true : false) : true;

	const toggleModal = () => {
		setShowModal(!showModal);
	};

	useEffect(() => {
		if (balanceAlert || getCookie("balance_alert")) {
			setLowBalance(true);
		}
	}, []);

	useEffect(() => {
		setLowBalance(balance.success ? balance.showAlert : false);
	}, [balance]);

	return (
		<>
			<span
				className="d-none"
				id="openWalletToggle"
				onClick={toggleModal}
			></span>
			{balance.showBalance && (
				<>
					{header ? (
						<>
							{user.user_type == "operator" ? (
								<li className={style.walletNew}>
									<a
										href="#"
										className={style.noCursor}
										onClick={(e) => e.preventDefault()}
									>
										<CustomImage
											className={style.walletIcon}
											alt="wallet"
											src={wallet}
											width="20"
											height="20"
										/>
										{balance.account_freeze == 1 ? (
											<SimpleTooltip text={messages.ISP_ACCOUNT_FREEZE}>
												<>
													<div className={style.ExpireOn}>
														Wallet&nbsp;
														<s>{formatPrice(balance.balance)}</s>
														&nbsp;
														<CustomImage
															alt="exclamation"
															src={sidebarExclamationIcon}
															width="12"
															height="12"
														/>
														<span>Account Freezed</span>
													</div>
												</>
											</SimpleTooltip>
										) : (
											<>
												<div className={style.ExpireOn}>
													Wallet
													{lowBalance && (
														<span>
															<CustomImage
																alt="exclamation"
																src={sidebarExclamationIcon2}
																width="12"
																height="12"
															/>
															&nbsp;
															{messages.FUNDS_RUNNING_LOW}
														</span>
													)}
												</div>
												<div className={style.Amount}>
													{formatPrice(balance.balance)}
												</div>
											</>
										)}
									</a>
								</li>
							) : (
								<li className={style.walletNew}>
									{balance.account_freeze == 1 ? (
										<SimpleTooltip text={messages.ISP_ACCOUNT_FREEZE}>
											<Link href="/myWallet">
												<CustomImage
													className={style.walletIcon}
													alt="plusIcon"
													src={wallet}
													width="20"
													height="20"
												/>
												<div className={style.ExpireOn}>
													Wallet
													<span>Account Freezed</span>
												</div>
												<div
													id="walletBalance"
													className={style.Amount}
												>
													<s>{formatPrice(balance.balance)}</s>
													&nbsp;
													<CustomImage
														alt="exclamation"
														src={sidebarExclamationIcon}
														width="12"
														height="12"
													/>
												</div>
											</Link>
										</SimpleTooltip>
									) : (
										<Link href="/myWallet">
											<CustomImage
												className={style.walletIcon}
												alt="plusIcon"
												src={wallet}
												width="20"
												height="20"
											/>
											<div className={style.ExpireOn}>
												Wallet
												{balance.walletExpiry && (
													<span>
														{balance.walletExpiry == "NA"
															? "Expiry: NA"
															: "Expires on " +
															  formatDate(balance.walletExpiry)}
													</span>
												)}
												{lowBalance && (
													<span>
														<CustomImage
															alt="exclamation"
															src={sidebarExclamationIcon2}
															width="12"
															height="12"
														/>
														&nbsp;
														{messages.FUNDS_RUNNING_LOW}
													</span>
												)}
											</div>
											<div
												id="walletBalance"
												className={style.Amount}
											>
												{formatPrice(balance.balance)}
											</div>
											{showAddButton && (
												<div
													className={style.addAmount}
													onClick={(e) => {
														e.preventDefault();
														toggleModal();
													}}
												></div>
											)}
										</Link>
									)}
								</li>
							)}
						</>
					) : (
						<>
							{user.user_type == "operator" ? (
								<li className={style2.walletNew}>
									<a
										href="/myWallet"
										onClick={(e) => e.preventDefault()}
									>
										<div className={style2.walletIcon}>
											<CustomImage
												src={sidebarWallet}
												alt="wallet"
												width="16"
												height="16"
											/>
										</div>
										<div className={style2.ExpireOn}>
											{balance.account_freeze == 1 ? (
												<>
													{formatPrice(balance.balance)}
													&nbsp;
													<CustomImage
														alt="exclamation"
														src={sidebarExclamationIcon}
														width="12"
														height="12"
													/>
												</>
											) : (
												<>
													{formatPrice(balance.balance)}
													{lowBalance && (
														<span>
															<CustomImage
																alt="exclamation"
																src={sidebarExclamationIcon2}
																width="12"
																height="12"
															/>
															&nbsp;
															{messages.FUNDS_RUNNING_LOW}
														</span>
													)}
												</>
											)}
											{balance.account_freeze == 1 && (
												<span>Account Freezed</span>
											)}
										</div>
									</a>
								</li>
							) : (
								<li className={style2.walletNew}>
									<Link
										href="/myWallet"
										onClick={handleHamburgerClick}
									>
										<div className={style2.walletIcon}>
											<CustomImage
												src={sidebarWallet}
												alt="wallet"
												width="16"
												height="16"
											/>
										</div>
										<div className={style2.ExpireOn}>
											{balance.account_freeze == 1 ? (
												<>
													<SimpleTooltip
														text={messages.ISP_ACCOUNT_FREEZE}
													>
														<s>{formatPrice(balance.balance, 0)}</s>
													</SimpleTooltip>
													&nbsp;
													<CustomImage
														alt="exclamation"
														src={sidebarExclamationIcon}
														width="12"
														height="12"
													/>
												</>
											) : (
												formatPrice(balance.balance, 0)
											)}
											{balance.account_freeze == 1 ? (
												<span>Account Freezed</span>
											) : (
												balance.walletExpiry && (
													<span>
														{balance.walletExpiry == "NA"
															? "Expiry: NA"
															: "Expires on " +
															  formatDate(balance.walletExpiry)}
													</span>
												)
											)}
											{lowBalance && (
												<span>
													<CustomImage
														alt="exclamation"
														src={sidebarExclamationIcon2}
														width="12"
														height="12"
													/>
													&nbsp;
													{messages.FUNDS_RUNNING_LOW}
												</span>
											)}
										</div>
										{showAddButton && balance.account_freeze == 0 && (
											<div
												className={style2.addAmount}
												onClick={(e) => {
													e.preventDefault();
													toggleModal();
												}}
											>
												<div className={style2.plusIcon}></div>
												Add
											</div>
										)}
									</Link>
								</li>
							)}
						</>
					)}
				</>
			)}

			{/* <CommonModal
				show={showModal}
				handleClose={toggleModal}
				centered={true}
				className={walletStyle.walletModal}
			>
				<AddBalancePopup toggleModal={toggleModal} />
			</CommonModal> */}
		</>
	);
}
