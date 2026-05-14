"use client";
import { useEffect, useState } from "react";
import CommonModal from "@/common/commonModal";
// import TermsAndConditions from "@/components/profile/termsAndConditions";
import ForcePasswordChange from "@/components/profile/forcePasswordChange";
// import BalanceAlertPopUp from "@/components/profile/balanceAlert";
import { getCookie, setCookie } from "@/utils/utils";
import PasswordChangeAlert from "../profile/passwordChangeAlert";
import BannerAlert from "../profile/bannerAlert";

export default function AccountActions({ terms, password, balance, bannerData }) {
	let showTerms = terms.success ? terms.showTerms : false;
	let showPassword = password.success ? password.isExpired : false;
	let passwordAlert = password.success ? password.showAlert : false;
	let balanceAlert = balance.success && balance.showBalance && balance.showAlert ? true : false;
	let bannerAlert = bannerData.banner ? bannerData.banner : false;

	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordAlertModal, setPasswordAlertModal] = useState(false);
	const [balanceAlertModel, setBalanceAlertModel] = useState(false);
	const [bannerAlertModal, setBannerAlertModal] = useState(false);

	useEffect(() => {
		if (showPassword) {
			setShowPasswordModal(true);
		} else if (showTerms) {
			setShowTermsModal(true);
		}

		if (bannerAlert && !getCookie("banner_alert")) {
			setCookie("banner_alert", 1, 6 * 30);
			setBannerAlertModal(true);
		}

		if (balanceAlert && !getCookie("balance_alert")) {
			setCookie("balance_alert", 1, 6 * 30);
			setBalanceAlertModel(true);
		}
		if (passwordAlert && !getCookie("password_alert")) {
			setCookie("password_alert", 1, 6 * 30);
			setPasswordAlertModal(true);
		}
	}, []);

	const toggleBalanceModal = () => {
		setBalanceAlertModel(!balanceAlertModel);
	};

	const togglePasswordModal = () => {
		setPasswordAlertModal(!passwordAlertModal);
	};

	const closeTermsModal = () => {
		setShowTermsModal(!showTerms);
	};

	const toggleBannerModal = () => {
		setBannerAlertModal(!bannerAlertModal);
	};

	return (
		<>
			{bannerAlertModal && (
				<CommonModal
					show={bannerAlertModal}
					handleClose={toggleBannerModal}
					className="bannerpop"
					centered={true}
				>
					<BannerAlert
						handleClose={toggleBannerModal}
						bannerImage={bannerData.banner.image_url}
					/>
				</CommonModal>
			)}

			{showPasswordModal && (
				<CommonModal
					show={showPasswordModal}
					className="updatePass"
					centered={true}
				>
					<ForcePasswordChange />
				</CommonModal>
			)}

			{passwordAlertModal && (
				<CommonModal
					show={passwordAlertModal}
					handleClose={togglePasswordModal}
					className="passwordalert"
					centered={true}
				>
					<PasswordChangeAlert
						remainDays={password.remainDays}
						handleClose={togglePasswordModal}
					/>
				</CommonModal>
			)}
		</>
	);
}
