"use client";
import Link from "next/link";
import SidebarItems from "./sidebarItems";
import CustomImage from "@/common/customImage";
import style from "@/css/common/sidebarOld.module.scss";
import { ispLogo, ottplayLogo } from "@/utils/imagesPicker";
import Wallet from "./wallet";

export default function Sidebar({ user, balance, planCount}) {
	return (
		<div
			className="sidebarOutter"
			id="sidebarOutter"
		>
			<input
				type="checkbox"
				id="toggle"
				className="toggle-checkbox"
			/>
			<label
				htmlFor="toggle"
				className={`${style.toggleButton} toggleButton`}
			></label>
			<aside className={`${style.sidebar} sidebar`}>
				<div className={style.ispLogo}>
					<CustomImage
						alt="ISP Logo"
						src={ispLogo}
						width="74"
						height="45"
					/>
				</div>
				<ul className={style.profileWrapper}>
					<li className={style.profile}>
						<Link
							href="/profile"
							onClick={() => {
								setTimeout(() => {
									jQuery("#sidebarClose").trigger("click");
								}, 200);
							}}
						>
							<div className={style.avatar}>{user.imageText}</div>
							<div className={style.profileDetail}>
								<p>{user.user_type}</p>
								<h3>{user.login_id}</h3>
							</div>
						</Link>
					</li>
					<Wallet
						balance={balance}
						user={user}
						header={false}
					/>
				</ul>
				<SidebarItems menus={user.menus} planCount={planCount}/>
				<a
					href="https://www.ottplay.com/"
					target="_blank"
					className={style.ottplaylogo}
				>
					<CustomImage
						alt="OTTplay Logo"
						src={ottplayLogo}
						width="115"
						height="45"
					/>
				</a>
				<div className={style.facingIssueBtn}>
					<Link
						href="/help"
						onClick={() => {
							setTimeout(() => {
								jQuery("#sidebarClose").trigger("click");
							}, 50);
						}}
					>
						Facing Issues?
					</Link>
				</div>
			</aside>
			<a
				href="#"
				className={style.MOverlay}
			></a>
			<a
				href="#"
				id="sidebarClose"
				style={{ display: "none" }}
				tabIndex="-1"
			></a>
		</div>
	);
}
