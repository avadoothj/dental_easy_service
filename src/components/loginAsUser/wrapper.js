"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import style from "@/css/wallet/myWallet.module.scss";
import CustomImage from "@/common/customImage";
import { addSubscriberImage } from "@/utils/imagesPicker";

export default function LoginAsUserWrapper({ response }) {
	useEffect(() => {
		if (response.success) {
			const params = new URL(document.location.toString()).searchParams;
			const token = params.get("t");

			if (token != null) {
				startSession(token);
			}
		}
	}, []);

	const startSession = async (token) => {
		try {
			await signIn("credentials", { token });
		} catch (error) {
			console.log("error", error);
		}
	};

	return (
		<div className={style.paymentFailSuccess}>
			<div className={style.inner}>
				{response.success ? (
					<h4>Please wait...</h4>
				) : (
					<>
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
					</>
				)}
			</div>
		</div>
	);
}
