"use client";
import CustomImage from "@/components/common/customImage";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { myPlansIcon } from "@/utils/imagesPicker";
import React, { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import { getDistributorRetailerPlans } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import DistributorRetailerPlansCoupon from "./distributorRetailerPlansCoupon";
import DistributorRetailerPlansAllocation from "./distributorRetailerPlansAllocation";

export default function DistributorRetailerPlans({ userType }) {
	const [planStatusList, SetPlanStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansStatus = async () => {
		setIsLoading(true);
		const response = await getDistributorRetailerPlans();
		setIsLoading(false);
		if (response.success) {
			SetPlanStatusList(response.data);
		}
	};

	useEffect(() => {
		getPlansStatus();
	}, []);

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
					Planwise Coupons
				</h2>
			</div>

			<div className={style.dashTable1}>
				{isLoading ? (
					<Loader />
				) : userType == "distributor" ? (
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
									<Nav.Link eventKey="myPlanTwo">Allocation</Nav.Link>
								</Nav.Item>
							</div>
						</Nav>
						<Tab.Content>
							<Tab.Pane
								eventKey="myPlanOne"
								className={style.dashTable1}
							>
								<DistributorRetailerPlansCoupon planStatusList={planStatusList} />
							</Tab.Pane>

							<Tab.Pane
								eventKey="myPlanTwo"
								className={style.dashTable1}
							>
								<DistributorRetailerPlansAllocation />
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
				) : (
					<DistributorRetailerPlansCoupon planStatusList={planStatusList} />
				)}
			</div>
		</div>
	);
}
