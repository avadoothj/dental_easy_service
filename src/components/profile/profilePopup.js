"use client";
import { useContext, useEffect, useRef, useState } from "react";
import ProfileDropdown from "@/components/profile/profileDropdown";
import style from "@/css/common/header.module.scss";
import CommonModal from "@/common/commonModal";
import ChangePassword from "./changePassword";
import SuccessPopup from "@/components/common/successPopup";
import messages from "@/utils/messages";
import { AppContext } from "@/contextProvider";

export default function ProfilePopup({ user, userMenu }) {
	const ref = useRef(null);
	const { showAlert } = useContext(AppContext);

	const [showModal, setShowModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showSuccessPop, setShowSuccessPop] = useState(false);

	const handleToggleClick = () => {
		setShowModal(!showModal);
	};

	const handleTogglePasswordClick = () => {
		if (!showPasswordModal) handleToggleClick();
		setShowPasswordModal(!showPasswordModal);
	};

	const handlePasswordSuccess = () => {
		setShowPasswordModal(false);
		// handleToggleSuccessModal();
		showAlert(messages.PASSWORD_CHANGE_SUCCESS, 1);
	};

	const handleToggleSuccessModal = () => {
		setShowSuccessPop(!showSuccessPop);
	};

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setShowModal(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<div ref={ref}>
				<a
					href="#"
					onClick={(e) => {
						e.preventDefault();
						handleToggleClick();
					}}
				>
					<div className={style.avatar}>{user.imageText}</div>
					<div className={`${style.profileDetail} ${showModal ? style.active : ""}`}>
						<p>{user.display_user_type}</p>
						<h3>{user.login_id}</h3>
					</div>
				</a>
				<ProfileDropdown
					user={user}
					userMenu={userMenu}
					showModal={showModal}
					handleTogglePasswordClick={handleTogglePasswordClick}
					handleToggleClick={handleToggleClick}
				/>
			</div>
			<CommonModal
				show={showPasswordModal}
				handleClose={handleTogglePasswordClick}
				className="updatePass"
				centered={true}
			>
				<ChangePassword
					postSuccess={handlePasswordSuccess}
					handleClose={handleTogglePasswordClick}
				/>
			</CommonModal>
			<CommonModal
				show={showSuccessPop}
				handleClose={handleToggleSuccessModal}
				className="termspop"
				centered={true}
			>
				<SuccessPopup
					message={messages.PASSWORD_CHANGE_SUCCESS}
					handleClose={handleToggleSuccessModal}
				/>
			</CommonModal>
		</>
	);
}
