"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import style from "@/css/profile/profileDropDown.module.scss";
import {
	apiDetailsIcon,
	changePasswordIcon,
	operatorIcon,
	teamIcon,
	userIcon,
} from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import Highlight from "./highlight";
import commonStyle from "@/css/common/common.module.scss";

import { AppContext } from "@/contextProvider";

export default function ProfileDropdown({
	showModal,
	user,
	userMenu,
	handleTogglePasswordClick,
	handleToggleClick,
}) {
	const { handleUserLogout } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogoutClick = (e) => {
		e.preventDefault();
		setIsLoading(!isLoading);
		handleUserLogout();
	};

	let teamMenuObj = null;
	JSON.parse(userMenu).map((x) => {
		x.filter((y) => y.link == "/team").map((y, i) => {
			teamMenuObj = y;
		});
	});

	return (
		<div className={`${style.wrapper} ${showModal ? style.show : ""}`}>
			<div className={style.operatorWrap}>
				<Highlight user={user} />
			</div>
			<ul className={style.navLists}>
				<li>
					<Link
						href="/profile#operatorDetails"
						onClick={() => handleToggleClick()}
					>
						<CustomImage
							alt="operator details"
							src={operatorIcon}
							className={style.accordionIcon}
							width="18"
							height="18"
						/>
						{user.user_type == "regional head" ? "Region" : user.display_user_type}
						&nbsp;Details
					</Link>
				</li>
				<li>
					<Link
						href="/profile#userDetails"
						onClick={() => handleToggleClick()}
					>
						<CustomImage
							alt="user details"
							src={userIcon}
							className={style.accordionIcon}
							width="18"
							height="18"
						/>
						My Details
					</Link>
				</li>
				{user.primary_user == 1 && (
					<li>
						<Link
							href="/profile#apiDetails"
							onClick={() => handleToggleClick()}
						>
							<CustomImage
								alt="api details"
								src={apiDetailsIcon}
								className={style.accordionIcon}
								width="18"
								height="18"
							/>
							API Details
						</Link>
					</li>
				)}
				{teamMenuObj !== null && (
					<li>
						<Link
							href={teamMenuObj.link}
							onClick={() => handleToggleClick()}
						>
							<CustomImage
								alt="user details"
								src={teamIcon}
								className={style.accordionIcon}
								width="18"
								height="18"
							/>
							{teamMenuObj.name}
						</Link>
					</li>
				)}
				<li>
				<Link
					href="#"
					onClick={(e) => {
						e.preventDefault();
						handleTogglePasswordClick();
					}}
				>
					<CustomImage
						alt="Change Password"
						src={changePasswordIcon}
						className={style.accordionIcon}
						width="18"
						height="18"
					/>
					Change Password
				</Link>
				</li>
			</ul>
			<button
				className={commonStyle.commonBtn + " " + "w-100 mt-3"}
				disabled={isLoading}
				onClick={(e) => handleLogoutClick(e)}
			>
				{isLoading ? "Logging out..." : "Logout"}
			</button>
		</div>
	);
}
