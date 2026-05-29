"use client";
import { useEffect, useState } from "react";
import style from "@/css/operator/operator.module.scss";
import DetailsView from "./detailsView";
import PlansView from "./plansView";
import BalanceView from "./balanceView";
import PageView from "../loading/pageView";
import TeamsView from "./teamsView";
import { useRouter } from "next/navigation";
import ShowTabCount from "@/components/common/showTabCount";

export default function DetailsWrapper({ operator, user, stateList }) {
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [teamCount, setTeamCount] = useState(operator.no_of_users);
	const [planCount, setPlanCount] = useState(operator.no_of_plans);
	const router = useRouter();

	useEffect(() => {
		const tempUrl = window.location.href.split("#");

		if (
			tempUrl.length > 1 &&
			(tempUrl[1] == "details" ||
				tempUrl[1] == "plans" ||
				tempUrl[1] == "teams" ||
				tempUrl[1] == "balance")
		) {
			setActiveTab(tempUrl[1]);
		}

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
			elem.addClass(style.OperatorDetails);
			elem.removeClass(style.OperatorTeam);
			elem.removeClass(style.OperatorPlans);
		} else if (activeTab == "teams") {
			elem.removeClass(style.OperatorDetails);
			elem.addClass(style.OperatorTeam);
			elem.removeClass(style.OperatorPlans);
		} else if (activeTab == "plans") {
			elem.removeClass(style.OperatorDetails);
			elem.removeClass(style.OperatorTeam);
			elem.addClass(style.OperatorPlans);
		} else if (activeTab == "balance") {
			elem.removeClass(style.OperatorDetails);
			elem.removeClass(style.OperatorPlans);
			elem.addClass(style.OperatorDetails);
		}
	};

	const backToOperators = () => {
		router.push("/operators");
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
			<div className={style.tabsWrapper}>
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
						Team <ShowTabCount count={teamCount} />
					</li>
					<li
						className={activeTab == "plans" ? style.active : ""}
						onClick={() => setActiveTab("plans")}
						id="plan_tab"
					>
						Plans <ShowTabCount count={planCount} />
					</li>
					<li
						className={activeTab == "balance" ? style.active : ""}
						onClick={() => setActiveTab("balance")}
					>
						Balance
					</li>
				</ul>
			</div>

			{isLoading ? (
				<PageView />
			) : (
				<>
					{activeTab == "details" && (
						<DetailsView
							operator={operator}
							stateList={stateList}
							user={user}
						/>
					)}
					{activeTab == "teams" && (
						<TeamsView
							user={user}
							operator={operator}
							setActiveTab={setActiveTab}
						/>
					)}

					{activeTab == "plans" && (
						<PlansView
							user={user}
							operator={operator}
							setActiveTab={setActiveTab}
						/>
					)}
					{activeTab == "balance" && (
						<BalanceView
							user={user}
							operator={operator}
							setActiveTab={setActiveTab}
						/>
					)}
				</>
			)}
			{activeTab == "details" && (
				<div className={style.btnWrapper}>
					<>
						<button
							id="operBtn"
							className="commonBtn borderBtn"
							onClick={backToOperators}
						>
							Back
						</button>

						{operator.no_of_users > 0 ? (
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
						)}
					</>
				</div>
			)}
		</>
	);
}
