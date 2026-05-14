"use client";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import style from "@/css/common/common.module.scss";
import CustomImage from "@/components/common/customImage";
import { myWalletIconDash } from "@/utils/imagesPicker";
import MyWalletStatus from "./myWalletStatus";
import MyWalletActivity from "./myWalletActivity";
import MyWalletOperatorStatus from "./operatorStatus";
import MyWalletIspStatus from "./ispStatus";

export default function MyWallet({ userType }) {
	const [activeTab, setActiveTab] = useState("status");

	return (
		<div className={style.dashcardlist}>
			<div className={style.headingWrap}>
				<h2>
					<CustomImage src={myWalletIconDash} />
					My Wallet
				</h2>
				{userType == "isp" && activeTab == "status" && (
					<button
						onClick={() => {
							document.getElementById("openWalletToggle").click();
						}}
					>
						Top Up Wallet
					</button>
				)}
			</div>
			<Tab.Container
				id="MyWallet"
				defaultActiveKey="myWalletStatus"
			>
				<Nav className={style.tabNav}>
					<div className={style.tabNavinner}>
						<Nav.Item onClick={() => setActiveTab("status")}>
							<Nav.Link eventKey="myWalletStatus">My Status</Nav.Link>
						</Nav.Item>

						{userType == "isp" && (
							<Nav.Item onClick={() => setActiveTab("oper_status")}>
								<Nav.Link eventKey="myWalletOperStatus">Operators’ Status</Nav.Link>
							</Nav.Item>
						)}

						{userType == "super isp" && (
							<Nav.Item onClick={() => setActiveTab("isp_status")}>
								<Nav.Link eventKey="myWalletIspStatus">ISP’s Status</Nav.Link>
							</Nav.Item>
						)}

						<Nav.Item onClick={() => setActiveTab("activity")}>
							<Nav.Link eventKey="myWalletActivity">Activity</Nav.Link>
						</Nav.Item>
					</div>
				</Nav>
				<Tab.Content>
					<Tab.Pane
						eventKey="myWalletStatus"
						className={style.dashTable1}
					>
						<MyWalletStatus />
					</Tab.Pane>

					{userType == "isp" && (
						<Tab.Pane
							eventKey="myWalletOperStatus"
							className={style.dashTable1}
						>
							<MyWalletOperatorStatus />
						</Tab.Pane>
					)}
					{userType == "super isp" && (
						<Tab.Pane
							eventKey="myWalletIspStatus"
							className={style.dashTable1}
						>
							<MyWalletIspStatus />
						</Tab.Pane>
					)}
					<Tab.Pane
						eventKey="myWalletActivity"
						className={style.dashTable1}
					>
						<MyWalletActivity userType={userType} />
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>
		</div>
	);
}
