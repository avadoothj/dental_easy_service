"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import style from "@/css/common/header.module.scss";
import ProfilePopup from "@/components/profile/profilePopup";
import sidebarStyle from "@/css/common/sidebar.module.scss";

export default function CommonHeader({ user, userMenu, balance, autoRenewal }) {
	const path = usePathname();
	const [showWallet, setShowWallet] = useState(false);
	const newDashBoardRole = ["super isp", "isp", "operator"];

	const handleHamburgerClick = () => {
		jQuery("#sidebarOutter").trigger("click");
		jQuery("#sidebarOutter").toggleClass(sidebarStyle.active);
		if (jQuery(".hamburgerGlobal").is(":visible")) {
			$("body").css(
				"overflow",
				$("body").css("overflow") === "hidden" ? "visible" : "hidden"
			);
		}
	};

	useEffect(() => {
		setShowWallet(user?.allowedLinks.indexOf("/ispWalletRecharge") >= 0 ? true : false);
		if (newDashBoardRole.includes(user.user_type) && path == "/") {
			setShowWallet(false);
		}
	}, [path]);

	return (
		<nav className={`${style.mainHeader} navbar navbar-expand`}>
			<a
				onClick={handleHamburgerClick}
				className={`${style.hamburger} hamburgerGlobal`}
			>
				<span></span>
			</a>
			<ul className={`${style.headerNav} navbar-nav ms-auto`}>
				<li className={style.profile}>
					<ProfilePopup
						user={user}
						userMenu={userMenu}
					/>
				</li>
			</ul>
		</nav>
	);
}
