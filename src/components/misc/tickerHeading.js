"use client";
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import commonStyle from "@/css/common/common.module.scss";
import { getCookie, setCookie } from "@/utils/utils";

export default function TickerHeading({ tickerData }) {
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		if (!getCookie("ticker_heading")) {
			setShowToast(true);
		}
	}, []);

	const handleCloseClick = () => {
		setCookie("ticker_heading", 1, 6 * 30);
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
				className={commonStyle.toastwrap}
			>
				<Toast.Body className={commonStyle.toastbody}>
					<div
						className={commonStyle.tbody}
						style={{
							//background: '#324234',
							backgroundColor: tickerData.color_code,
						}}
					>
						<p
							dangerouslySetInnerHTML={{
								__html: tickerData.heading,
							}}
						></p>
						<div
							className={commonStyle.closetoast}
							onClick={handleCloseClick}
							style={{
								backgroundColor: tickerData.color_code,
							}}
						>
							X
						</div>
					</div>
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);
}
