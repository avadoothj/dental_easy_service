"use client";
import { useEffect, useState } from "react";
import style from "@/css/operator/operator.module.scss";
import OperatorList from "./operatorList";
import SearchFilterOperator from "./searchFilterOperator";
import SearchFilterMobileOperator from "./searchFilterMobileOperator";
import { sortList } from "@/utils/masterData";
// import AddOperatorForm from "@/components/operators/details/addForm";

export default function OperatorView({ isp, user, stateList }) {
	const [keyword, setKeyword] = useState("");
	const [searchText, setSearchText] = useState("");
	const [status, setStatus] = useState("");
	const [sortBy, setSortBy] = useState(sortList[0].id);
	const [showAddOperator, setShowAddOperator] = useState(false);

	const handleAddAction = () => {
		setShowAddOperator(!showAddOperator);
	};

	const handleViewPlanAction = () => {
		jQuery("#stack_plans").trigger("click");
	};

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			setSearchText(keyword);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	return (
		<>
			{!showAddOperator ? (
				<>
					<div className={`${style.teamCardWrapper} teamCardWrapper`}>
						<SearchFilterOperator
							setKeyword={setKeyword}
							setStatus={setStatus}
							handleSort={setSortBy}
							keyword={keyword}
							setSortBy={setSortBy}
							sortBy={sortBy}
						/>

						<SearchFilterMobileOperator
							setKeyword={setKeyword}
							setStatus={setStatus}
							setSortBy={setSortBy}
							keyword={keyword}
						/>
						<OperatorList
							isp={isp}
							user={user}
							stateList={stateList}
							search={searchText}
							status={status}
							sortBy={sortBy}
							handleAddAction={handleAddAction}
						/>
					</div>
					<div className={style.btnWrapper}>
						{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
							<button
								id="operatorBtn"
								className="commonBtn borderBtn"
								onClick={handleAddAction}
							>
								Add More Operator
							</button>
						)}

						<button
							className="commonBtn dark"
							onClick={handleViewPlanAction}
						>
							View Plans
						</button>
					</div>
				</>
			) : (
				<AddOperatorForm
					user={user}
					stateList={stateList}
					showIspList={false}
					isp_id={isp.oper_id}
					backAction={handleAddAction}
				/>
			)}
		</>
	);
}
