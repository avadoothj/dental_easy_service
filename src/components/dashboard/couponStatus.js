"use client";
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { getCouponStatus } from "@/controllers/dashboard";
import style from "@/css/common/common.module.scss";
import CustomImage from "@/components/common/customImage";
import { subscribersDash } from "@/utils/imagesPicker";
import Loader from "@/components/common/loader";
import MyCouponStatus from "./myCouponStatus";
import MyCouponAllocation from "./myCouponAllocation";

export default function CouponStatus({ userType }) {
	const [isLoading, setIsLoading] = useState(true);
	const [couponStatusResponse, setCouponStatusResponse] = useState("155");

	useEffect(() => {
		if (document.body.clientWidth < 400) {
			setWidth("147");
			setHeight("147");
		}

		getSubscriberCount();
	}, []);

	const getSubscriberCount = async () => {
		setIsLoading(true);
		const response = await getCouponStatus();
		setIsLoading(false);

		if (response.success) {
			setCouponStatusResponse(response);
		}
	};

	return (
		<>
			<div className={`${style.dashcard} ${style.ISPsubscribe}`}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								src={subscribersDash}
								alt="subscribersIcon"
								width="29"
								height="29"
							/>
						</span>
						My Status
					</div>
				</div>

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
								<MyCouponStatus
									userType={userType}
									response={couponStatusResponse}
								/>
							</Tab.Pane>

							<Tab.Pane
								eventKey="myPlanTwo"
								className={style.dashTable1}
							>
								<MyCouponAllocation userType={userType} />
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
				) : (
					<MyCouponStatus
						userType={userType}
						response={couponStatusResponse}
					/>
				)}
			</div>
		</>
	);
}
