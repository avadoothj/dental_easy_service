"use client";
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import commonStyle from "@/css/common/common.module.scss";

export default function AccountTakeoverHeading({ user }) {
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		setShowToast(true);
	}, []);

	const handleCloseClick = () => {
		setShowToast(false);
	};

	return (
		<ToastContainer
			position="top-center"
			className={commonStyle.msgNewVersion}
		>
			<Toast
				onClose={handleCloseClick}
				show={showToast}
				className={commonStyle.toastwrapAlert}
			>
				<Toast.Body className={commonStyle.toastbody}>
					<div className={commonStyle.tbody}>
						<p>
							<span>{user.accountTakeover}</span>
							&nbsp;has logged in as&nbsp;
							<span>{user.login_id}</span>
						</p>
						<div
							className={commonStyle.closetoast}
							onClick={handleCloseClick}
						>
							X
						</div>
					</div>
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);
}
