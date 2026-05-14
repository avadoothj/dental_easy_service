import { useEffect, useState } from "react";
import PlanList from "../planList";
import style from "@/css/operator/operator.module.scss";
import { getConstant } from "@/utils/utils";

export default function PlansView({ isp, setActiveTab }) {
	const [keyword, setKeyword] = useState("");
	const [searchText, setSearchText] = useState("");
	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			setSearchText(keyword);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	const handleViewBalanceAction = () => {
		setActiveTab("balance");
	};

	return (
		<>
			<div className={style.PlansWrapper}>
				<div className={style.setPlanWrap}>
					<div className={style.heading}>
						<h2>Plans</h2>
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
						isp={isp}
						ispId={isp.oper_id}
						showSyncPlan={false}
						keyword={searchText}
					/>
				</div>
			</div>
			<div className={style.btnWrapper}>
				<button
					className="commonBtn dark"
					onClick={handleViewBalanceAction}
				>
					View Balance
				</button>
			</div>
		</>
	);
}
