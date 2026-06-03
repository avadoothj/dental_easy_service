"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "@/css/isp/isp.module.scss";
import operatorStyle from "@/css/operator/operator.module.scss";
import DetailsView from "./detailsView";
import PlansView from "./plansView";
import BalanceView from "./balanceView";
import PageView from "../loading/pageView";
import TeamsView from "./teamsView";
import OperatorView from "./operatorsView";
import ShowTabCount from "@/components/common/showTabCount";

export default function DetailsWrapper({ isp, user, stateList }) {
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	// const [teamCount, setTeamCount] = useState(isp.no_of_users);
	// const [planCount, setPlanCount] = useState(isp.no_of_plans);
	// const [operatorCount, setOperatorCount] = useState(isp.no_of_operators);
	const router = useRouter();

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	useEffect(() => {
		if (typeof jQuery == "undefined") {
			const interval = setInterval(() => {
				if (typeof jQuery != "undefined") {
					clearInterval(interval);
					addRemoveClass();
				}
			}, 200);
		} else {
			addRemoveClass();
		}
	}, [activeTab]);

	const addRemoveClass = () => {
		const elem = jQuery("#headerWrapper");
		if (activeTab == "details") {
			elem.addClass(style.isprow);
			elem.addClass(style.addmember);
			elem.removeClass(style.SubscriberHistory);
			elem.removeClass(operatorStyle.operatorDetails);
			elem.removeClass(style.SubscriberPlans);
			elem.removeClass(style.tabs);
		} else if (activeTab == "teams") {
			elem.removeClass(style.isprow);
			elem.removeClass(style.addmember);
			elem.addClass(style.SubscriberHistory);
			elem.addClass(operatorStyle.OperatorTeam);
			elem.removeClass(operatorStyle.operatorDetails);
			elem.removeClass(style.SubscriberPlans);
			elem.removeClass(style.tabs);
		} else if (activeTab == "operators") {
			elem.removeClass(style.isprow);
			elem.removeClass(style.addmember);
			elem.removeClass(style.SubscriberHistory);
			elem.addClass(operatorStyle.OperatorDetails);
			elem.addClass(operatorStyle.OperatorTeam);
			elem.removeClass(style.SubscriberPlans);
			elem.removeClass(style.tabs);
		} else if (activeTab == "plans") {
			elem.removeClass(style.isprow);
			elem.removeClass(style.addmember);
			elem.removeClass(style.SubscriberHistory);
			elem.removeClass(operatorStyle.operatorDetails);
			elem.addClass(operatorStyle.OperatorPlans);
			elem.removeClass(style.tabs);
		} else if (activeTab == "balance") {
			elem.removeClass(style.isprow);
			elem.removeClass(style.addmember);
			elem.removeClass(style.SubscriberHistory);
			elem.removeClass(operatorStyle.operatorDetails);
			elem.removeClass(style.SubscriberPlans);
		}
	};

	const handleResetPlanPage = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};

	const backToIsp = () => {
		router.push("/isp");
	};

	const handleAddTeam = () => {
		setActiveTab("teams");
		const interval = setInterval(() => {
			if (jQuery("#addTeamMember").length > 0) {
				clearInterval(interval);
				jQuery("#addTeamMember").trigger("click");
			}
		}, 50);
	};

	return (
		<>
			<ul className={style.tabs}>
				<li
					className={activeTab == "details" ? style.active : ""}
					onClick={() => setActiveTab("details")}
				>
					Details
				</li>
				<li
					className={activeTab == "teams" ? style.active : ""}
					onClick={() => setActiveTab("teams")}
				>
					Team <ShowTabCount count={1} />
				</li>
				{/* <li
					id="stack_operator"
					className={activeTab == "operators" ? style.active : ""}
					onClick={() => setActiveTab("operators")}
				>
					Operators <ShowTabCount count={operatorCount} />
				</li> */}
				{/* <li
					id="stack_plans"
					className={activeTab == "plans" ? style.active : ""}
					onClick={() => setActiveTab("plans")}
				>
					Plans <ShowTabCount count={planCount} />
				</li> */}
				<li
					className={activeTab == "balance" ? style.active : ""}
					onClick={() => setActiveTab("balance")}
				>
					Balance
				</li>
			</ul>

			{isLoading ? (
				<PageView />
			) : (
				<>
					{activeTab == "details" && (
						<DetailsView
							isp={isp}
							user={user}
							stateList={stateList}
							handleResetPlanPage={handleResetPlanPage}
						
						/>
					)}
					{activeTab == "teams" && (
						<TeamsView
							user={user}
							isp={isp}
							setActiveTab={setActiveTab}
						/>
					)}
					{activeTab == "operators" && (
						<OperatorView
							user={user}
							isp={isp}
							setActiveTab={setActiveTab}
							stateList={stateList}
						/>
					)}
					{activeTab == "plans" && (
						<PlansView
							isp={isp}
							setActiveTab={setActiveTab}
						/>
					)}
					{/* {activeTab == "balance" && (
						<BalanceView
							isp={isp}
							isAllowBalancePage={isAllowBalancePage}
						/>
					)} */}
				</>
			)}
			{activeTab == "details" && (
				<div className={style.btnWrapper}>
					<>
						<button
							id="operBtn"
							className="commonBtn borderBtn"
							onClick={backToIsp}
						>
							Back
						</button>

						{/* {isp.no_of_users > 0 ? (
							<button
								id="teamBtn"
								className="commonBtn dark"
								onClick={() => setActiveTab("teams")}
							>
								View Team
							</button>
						) : (
							<>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<button
										id="teamBtn"
										className="commonBtn dark"
										onClick={handleAddTeam}
									>
										Add Team
									</button>
								)}
							</>
						)} */}
					</>
				</div>
			)}
		</>
	);
}
