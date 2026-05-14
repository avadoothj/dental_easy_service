"use client";
import CustomImage from "@/components/common/customImage";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import style from "@/css/common/common.module.scss";
import { myPlansIcon } from "@/utils/imagesPicker";
import React, { useEffect, useState } from "react";
import { getDistributorRetailerPlans } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import DistributorRetailerPlansCoupon from "./distributorRetailerPlansCoupon";
import DistributorRetailerPlansAllocation from "./distributorRetailerPlansAllocation";

export default function RetailerPlans({ userType }) {
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
		<>
			<div className={style.dashcard}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								src={myPlansIcon}
								alt="myPlansIcon"
								width="29"
								height="29"
							/>
						</span>
						Planwise Coupons
					</div>
				</div>
				<div className={style.planRenewingTable}>
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
									className={style.dashTable}
								>
									<DistributorRetailerPlansCoupon
										planStatusList={planStatusList}
									/>
								</Tab.Pane>

								<Tab.Pane
									eventKey="myPlanTwo"
									className={style.dashTable}
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
		</>
	);
}
