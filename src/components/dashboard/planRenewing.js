"use client";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import style from "@/css/common/common.module.scss";
import CustomImage from "@/components/common/customImage";
import { planRenewing } from "@/utils/imagesPicker";
import PlanRenewingStatus from "./planRenewingStatus";
import AutoRenewalStatus from "./autoRenewalStatus";
import CommonModal from "@/common/commonModal";
import PlanRenewingStatusModal from "./planRenewingStatusModal";

export default function PlanRenewing() {
	const [activeTab, setActiveTab] = useState("plan_renewing");
	const [renewingCount, setRenewingCount] = useState(0);
	const [autoRenewCount, setAutoRenewCount] = useState(0);
	const [showAutoRenewalStatusModal, setShowAutoRenewalStatusModal] = useState(false);

	const toggleOperatorStatusModal = () => {
		setShowAutoRenewalStatusModal(!showAutoRenewalStatusModal);
	};

	return (
		<>
			<div className={`${style.dashcard} ${style.ISPrenval}`}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								src={planRenewing}
								alt="plan renewing"
								width="29"
								height="29"
							/>
						</span>
						Subscriber Requests
					</div>
					{(renewingCount > 0 || autoRenewCount > 0) && (
						<button
							className={style.btndash}
							onClick={toggleOperatorStatusModal}
						>
							View All
						</button>
					)}
				</div>
				<div className={style.planRenewingTable}>
					<Tab.Container
						id="planRenewing"
						defaultActiveKey="planRenewingStatus"
					>
						<Nav className={style.tabNav}>
							<div className={style.tabNavinner}>
								<Nav.Item onClick={() => setActiveTab("plan_renewing")}>
									<Nav.Link eventKey="planRenewingStatus">Plan Renewal</Nav.Link>
								</Nav.Item>

								<Nav.Item onClick={() => setActiveTab("auto_renewal")}>
									<Nav.Link eventKey="autoRenewalStatus">Auto Renewal Setting</Nav.Link>
								</Nav.Item>
							</div>
						</Nav>
						<Tab.Content>
							<Tab.Pane
								eventKey="planRenewingStatus"
								className={style.dashTable}
							>
								<PlanRenewingStatus setRenewingCount={setRenewingCount} />
							</Tab.Pane>

							<Tab.Pane
								eventKey="autoRenewalStatus"
								className={style.dashTable}
							>
								<AutoRenewalStatus setAutoRenewCount={setAutoRenewCount} />
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
				</div>
			</div>

			<CommonModal
				show={showAutoRenewalStatusModal}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleOperatorStatusModal}
				animation={false}
			>
				<PlanRenewingStatusModal
					tabName="TabOne"
					handleClose={toggleOperatorStatusModal}
				/>
			</CommonModal>
		</>
	);
}
