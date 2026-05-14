"use client";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import style from "@/css/common/common.module.scss";
import CustomImage from "@/components/common/customImage";
import { myPlansIcon } from "@/utils/imagesPicker";
import MyPlansStatus from "./myPlansStatus";
import MyPlansPerformance from "./myPlansPerformance";

export default function MyPlans({ userType }) {
	return (
		<div className={style.dashcardlist}>
			<div className={style.headingWrap}>
				<h2>
					<CustomImage
						src={myPlansIcon}
						alt="myPlansIcon"
						width="29"
						height="29"
					/>
					My Plans
				</h2>
			</div>

			<Tab.Container
				id="MyPlans"
				defaultActiveKey="myPlanOne"
			>
				<Nav className={style.tabNav}>
					<div className={style.tabNavinner}>
						<Nav.Item>
							<Nav.Link eventKey="myPlanOne">Status</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="myPlanTwo">Performance</Nav.Link>
						</Nav.Item>
					</div>
				</Nav>
				<Tab.Content>
					<Tab.Pane
						eventKey="myPlanOne"
						className={style.dashTable1}
					>
						<MyPlansStatus userType={userType} />
					</Tab.Pane>

					<Tab.Pane
						eventKey="myPlanTwo"
						className={style.dashTable1}
					>
						<MyPlansPerformance userType={userType} />
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>
		</div>
	);
}
