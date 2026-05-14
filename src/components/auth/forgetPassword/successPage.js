import CustomImage from "@/components/common/customImage";
import style from "@/css/auth/login.module.scss";
import { checkIcon } from "@/utils/imagesPicker";
import Link from "next/link";

export default function SuccessPage({ username }) {
	return (
		<>
			<h2>Password Reset Successfully</h2>
			<div className={style.resetTick}>
				<CustomImage
					alt="success"
					src={checkIcon}
					width="40"
					height="40"
				/>
			</div>
			<div className={style.usenames}>{username}</div>
			<Link
				href="/login"
				className="commonBtn loginbtn borderBtn"
			>
				Back To Sign In
			</Link>
		</>
	);
}
