import React, { useEffect, useState } from "react";
import PlanList from "@/components/operators/details/planList";
import PlanPriceSet from "@/components/operators/details/planPriceSet";
import NoPlan from "@/components/operators/noPlan";
import style from "@/css/operator/operator.module.scss";
import { getConstant } from "@/utils/utils";

export default function PlansView({ operator, setActiveTab, user }) {
	const [planAction, setPlanAction] = useState(operator.no_of_plans > 0 ? "view" : "noView");
	const [selectedPlan, setSelectedPlan] = useState({});

	const [keyword, setKeyword] = useState("");
	const [searchText, setSearchText] = useState("");
	const [isAssignedPlan, setIsAssignedPlan] = useState(true);

	const [showAssignPlanList, setShowAssignPlanList] = useState(
		operator.no_of_plans > 0 ? false : true
	);

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			setSearchText(keyword);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	const handleAssignPlanClick = () => {
		setShowAssignPlanList(true);
		setIsAssignedPlan(false);
		setPlanAction("view");
	};

	const handleSavePlanClick = () => {
		setShowAssignPlanList(false);
		setPlanAction("view");
	};

	const handleAssignPlanBackBtn = () => {
		if (operator.no_of_plans > 0) {
			setShowAssignPlanList(false);
			setPlanAction("view");
			setIsAssignedPlan(true);
		} else {
			setPlanAction("noView");
		}
	};

	const handlePlanSelect = (item) => {
		if (user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0) {
			setSelectedPlan(item);
			setPlanAction("add");
		}
	};

	const handlePlanPriceBackBtn = () => {
		setPlanAction("view");
	};

	const handleAddBalanceBtn = () => {
		setActiveTab("balance");
		const interval = setInterval(() => {
			if (jQuery("#addBalance").length > 0) {
				clearInterval(interval);
				jQuery("#addBalance").trigger("click");
			}
		}, 50);
	};

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	return (
		<>
			{planAction == "noView" && (
				<NoPlan
					handleAssignPlan={handleAssignPlanClick}
					user={user}
				/>
			)}

			{planAction == "view" && (
				<>
					<div className={style.PlansWrapper}>
						<div className={style.setPlanWrap}>
							<div className={style.heading}>
								<h2>
									{isAssignedPlan ? "Assigned Plans" : "Select Plan to Set Price"}
								</h2>
								<div className={style.planSearch}>
									<input
										type="text"
										value={keyword}
										placeholder="Search Plans"
										onChange={(e) => setKeyword(e.target.value)}
										maxLength={inputMaxLength}
									/>
									{keyword.length > 0 && (
										<div
											onClick={() => setKeyword("")}
											className={style.closeBtn}
										></div>
									)}
								</div>
							</div>
							<div className={style.MsearchWrap}>
								<h3>Plans</h3>
								<div className={style.searchBtn}>
									{keyword.length == 0 && (
										<button
											className={style.btnsearch}
											onClick={() => {
												jQuery("#oper_plan_search_mob").trigger("focus");
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={style.svgiconsearchmob}
												viewBox="0 0 16 16"
											>
												<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
											</svg>
										</button>
									)}
									<input
										type="text"
										value={keyword}
										id="oper_plan_search_mob"
										placeholder="Search"
										onChange={(e) => setKeyword(e.target.value)}
										maxLength={inputMaxLength}
									/>
									{keyword.length > 0 && (
										<div
											onClick={() => setKeyword("")}
											className={style.closeBtn}
										></div>
									)}
								</div>
							</div>

							<PlanList
								keyword={searchText}
								operator={operator}
								handlePlanSelect={handlePlanSelect}
								showAssignPlanList={showAssignPlanList}
							/>
						</div>
					</div>

					<div className={style.btnWrapper}>
						{showAssignPlanList ? (
							<button
								onClick={handleAssignPlanBackBtn}
								className="commonBtn borderBtn"
							>
								Back
							</button>
						) : (
							<>
								{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
									<button
										onClick={handleAssignPlanClick}
										className="commonBtn borderBtn"
									>
										Assign Plan
									</button>
								)}
								{operator.available_balance > 0 ? (
									<button
										className="commonBtn dark"
										onClick={() => setActiveTab("balance")}
									>
										View Balance
									</button>
								) : (
									<>
										{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
											<button
												className="commonBtn dark"
												onClick={() => handleAddBalanceBtn()}
											>
												Add Balance
											</button>
										)}
									</>
								)}
							</>
						)}
					</div>
				</>
			)}
			{planAction == "add" && (
				<PlanPriceSet
					operator={operator}
					planDetail={selectedPlan}
					handleSavePlanClick={handleSavePlanClick}
					handlePlanPriceBackBtn={handlePlanPriceBackBtn}
				/>
			)}
		</>
	);
}
