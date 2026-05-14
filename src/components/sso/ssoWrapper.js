"use client";
import { useEffect } from "react";
import Link from "next/link";
import style from "@/css/wallet/myWallet.module.scss";
import CustomImage from "@/common/customImage";
import { eraseCookie } from "@/utils/utils";
import { addSubscriberImage } from "@/utils/imagesPicker";

export default function SsoWrapper({ response }) {
	useEffect(() => {
		eraseCookie("sso_response");
	}, []);

	return (
		<div className={style.paymentFailSuccess}>
			<div className={style.inner}>
				<div className={style.imagebox}>
					<CustomImage
						alt={"error"}
						src={addSubscriberImage}
						width="314"
						height="314"
					/>
				</div>
				<h3>Oops!</h3>
				<h4>{response.msg}</h4>
				<Link
					href="/"
					className="commonBtn dark"
				>
					Back To Dashboard
				</Link>
			</div>
		</div>
	);
}
