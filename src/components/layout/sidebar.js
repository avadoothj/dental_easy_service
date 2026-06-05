"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import SidebarItems from "./sidebarItems";
import CustomImage from "@/common/customImage";
import sidebarStyle from "@/css/common/sidebar.module.scss";
import { ottplayLogo, logOutImg, bundlrLogo } from "@/utils/imagesPicker";
import {dentallogo}from "@/utils/images/common"
import Wallet from "./wallet";
import { AppContext } from "@/contextProvider";
import SidebarLoading from "./sidebarLoading";

export default function Sidebar({ user, balance, planCount, autoRenewal, userMenu }) {
	const { handleUserLogout } = useContext(AppContext);

	const [isSidebarClosed, setIsSidebarClosed] = useState(false);

	const handleLogoutClick = (e) => {
		e.preventDefault();
		handleUserLogout();
	};

	const handleHamburgerClick = () => {
		jQuery("#sidebarOutter").trigger("click");
		jQuery("#sidebarOutter").toggleClass("active");
		if (jQuery(".hamburgerGlobal").is(":visible")) {
			$("body").css(
				"overflow",
				$("body").css("overflow") === "hidden" ? "visible" : "hidden",
			);
		}
	};

	const handleToggleClick = () => {
		jQuery("#toggleButton").toggleClass(sidebarStyle.checked);
		isSidebarClosedHandler();
	};

	const isSidebarClosedHandler = () => {
		setIsSidebarClosed(!isSidebarClosed);
	};

	return (
		<div
			className={`${sidebarStyle.sidebarOutter} ${isSidebarClosed ? sidebarStyle.checked : ""}`}
			id="sidebarOutter"
		>
			<div
				className={`${sidebarStyle.toggleButton} toggleButton`}
				id="toggleButton"
				onClick={handleToggleClick}
			></div>

			<aside className={`${sidebarStyle.sidebar} sidebar`}>
				<Link href="/" className={sidebarStyle.ispLogo}>
					{/* <CustomImage
						alt="Dental Easy Services Logo"
						src={dentallogo}
						width="115"
						height="45"
					/> */}
				</Link>
				<ul className={sidebarStyle.profileWrapper}>
					<li className={sidebarStyle.profile}>
						<Link
							href="/profile"
							onClick={handleHamburgerClick}
						>
							<div className={sidebarStyle.avatar}>{user.imageText}</div>
							<div className={sidebarStyle.profileDetail}>
								<p>
									{user.user_type == "internal"
										? user.display_user_type
										: user.oper_name}
								</p>
								<h3>{user.login_id}</h3>
							</div>
						</Link>
					</li>
					{user?.allowedLinks.indexOf("/ispWalletRecharge") >= 0 && (
						<Wallet
							balance={balance}
							user={user}
							header={false}
							handleHamburgerClick={handleHamburgerClick}
						/>
					)}
				</ul>
				{userMenu === null ? (
					<SidebarLoading />
				) : (
					<SidebarItems
						menus={userMenu}
						planCount={planCount}
						handleHamburgerClick={handleHamburgerClick}
					/>
				)}
				<div className={sidebarStyle.footerBtn}>
					<Link
						href="#"
						className={sidebarStyle.logout}
						onClick={handleLogoutClick}
					>
						<CustomImage
							src={logOutImg}
							alt="reports"
						/>
						Logout
					</Link>
				</div>
			</aside>
			<a
				onClick={handleHamburgerClick}
				className={sidebarStyle.MOverlay}
			></a>
		</div>
	);
}
