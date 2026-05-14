"use client";
import { useContext } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { AppContext } from "@/contextProvider";
import commonStyle from "@/css/common/common.module.scss";
import CustomImage from "@/common/customImage";
import { exclamationSvg, tickIcon, infoIconTheme } from "@/utils/imagesPicker";

export default function ToastComponent() {
	const { toastQueue, removeToast } = useContext(AppContext);

	const cssClasses = {
		1: commonStyle.msgsucess,
		2: commonStyle.msgwarning,
		3: commonStyle.msginfo,
	};

	const images = {
		1: tickIcon,
		2: exclamationSvg,
		3: infoIconTheme,
	};

	return (
		<ToastContainer position="top-center">
			{toastQueue.map((toast) => {
				return (
					<Toast
						key={toast.id}
						className={`${cssClasses[toast.data.type]} ${commonStyle.toastwrap}`}
						onClose={() => removeToast(toast.id)}
						show={true}
						delay={5000}
						autohide
					>
						<Toast.Body className={commonStyle.toastbody}>
							<div className={commonStyle.head}></div>
							<div className={commonStyle.tbody}>
								<div className={commonStyle.tdleft}>
									<div className={commonStyle.examl}>
										<CustomImage
											src={images[toast.data.type]}
											alt={toast.data.heading}
											width="18"
											height="18"
										/>
									</div>
									<div>
										<div className={commonStyle.heading}>
											{toast.data.heading}
										</div>
										<div className={commonStyle.errmsg}>{toast.message}</div>
									</div>
									<div
										className={commonStyle.closetoast}
										onClick={() => removeToast(toast.id)}
									>
										X
									</div>
								</div>
							</div>
						</Toast.Body>
					</Toast>
				);
			})}
		</ToastContainer>
	);
}
