import React, { useEffect, useRef, useState } from "react";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import PlanCard from "./planCard";
import { getConstant } from "@/utils/utils";
import { getPlanList } from "@/controllers/operators";
import operatorStyle from "@/css/operator/operator.module.scss";
import PlanLoading from "@/components/operators/loading/planLoading";
import NoRecords from "@/components/operators/noRecords";
import ShowFilterRecordCount from "@/components/common/showFilterRecordCount";

export default function PlanList({ showAssignPlanList, keyword, operator, handlePlanSelect }) {
	const isFirstSearch = useRef(true);

	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(-1);
	const [filterCount, setFilterCount] = useState(-1);

	const perPageItems = getConstant("PLANS_LIMIT");

	useEffect(() => {
		if (currentPage > 0) {
			handleFetchData();
		} else {
			setCurrentPage(1);
		}
	}, [currentPage]);

	useEffect(() => {
		if (isFirstSearch.current) {
			isFirstSearch.current = false;
			return;
		}

		setCurrentPage(0);
	}, [showAssignPlanList, keyword]);

	const handleFetchData = async () => {
		const params = {
			search: keyword,
			page_no: currentPage,
			oper_id: operator.oper_id,
			isAssignPlan: showAssignPlanList ? 1 : 0,
		};

		setIsLoading(true);

		const data = await getPlanList(params);
		setList((list) => {
			if (currentPage == 1) return data.list;
			return [...list, ...data.list];
		});

		if (currentPage == 1) {
			setTotalCount(data.total ?? -1);
			setFilterCount(data.filter ?? -1);
		}

		setHasMore(data.list.length == perPageItems);
		setIsLoading(false);
	};

	const scrollOptions = {
		items: list,
		hasMore: hasMore,
		fetchData: () => {
			if (!isLoading) setCurrentPage((number) => parseInt(number) + 1);
		},
	};

	const reloadData = () => {
		setCurrentPage(0);
	};

	return (
		<>
			{isLoading && currentPage <= 1 ? (
				<PlanLoading />
			) : (
				<>
					{filterCount >= 0 && (
						<ShowFilterRecordCount
							filterCount={filterCount}
							totalCount={totalCount}
						/>
					)}
					{list.length > 0 ? (
						<CustomInfiniteScroll {...scrollOptions}>
							<div className={`${operatorStyle.planCardWrapper} operatorPlanCard`}>
								{list.map((x, i) => (
									<PlanCard
										key={i}
										item={x}
										reloadData={reloadData}
										operator={operator}
										showUnassignPlanBtn={showAssignPlanList ? false : true}
										handlePlanSelect={handlePlanSelect}
									/>
								))}
							</div>
						</CustomInfiniteScroll>
					) : (
						<NoRecords noPadding={true} />
					)}
				</>
			)}
		</>
	);
}
