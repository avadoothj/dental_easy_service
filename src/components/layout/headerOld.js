import Link from "next/link";
import style from "@/css/common/header.module.scss";
import ProfilePopup from "@/components/profile/profilePopup";
import Wallet from "./wallet";

export default function CommonHeader({ user, balance }) {
	return (
		<nav className={`${style.mainHeader} navbar navbar-expand`}>
			<a
				href="#sidebarOutter"
				className={`${style.hamburger} hamburgerGlobal`}
			>
				<span></span>
			</a>
			<ul className={`${style.headerNav} navbar-nav ms-auto`}>
				<Wallet
					balance={balance}
					user={user}
				/>
				<li className={style.facingIssue}>
					<Link href="/help">Facing Issues?</Link>
				</li>
				<li className={style.profile}>
					<ProfilePopup user={user} />
				</li>
			</ul>
		</nav>
	);
}
