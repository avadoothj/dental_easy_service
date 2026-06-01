"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CustomImage from "@/common/customImage";
import style from "@/css/wallet/myWallet.module.scss";
import { addSubscriberImage } from "@/utils/imagesPicker";

export default function AuthCallback() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<div className="contentWrapper contentWrapperPreAuth">
			<main className="mainbox p-2">
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
						<h4>{error}</h4>
						<Link
							href="/"
							className="commonBtn dark"
						>
							Go Back
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
