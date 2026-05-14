"use client";
import { useEffect, useRef, useState } from "react";
import PlanCard from "./planCard";
import { getIspPlanList } from "@/controllers/isp";
import style from "@/css/plan/plan.module.scss";
import NoPlans from "@/components/plans/noPlans";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "@/components/plans/loading/card";
import { getConstant } from "@/utils/utils";
import ShowFilterRecordCount from "../common/showFilterRecordCount";

export default function PlanList({ isp = {}, ispId, keyword }) {
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
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	useEffect(() => {
		if (isFirstSearch.current) {
			isFirstSearch.current = false;
			return;
		}

		if (currentPage > 0) {
			handleFetchData();
		} else {
			setCurrentPage(1);
		}
	}, [keyword]);

	const reloadData = () => {
		setCurrentPage(0);
	};

	const handleFetchData = async () => {
		const params = {
			search: keyword,
			page_no: currentPage,
			isp_id: ispId,
		};

		setIsLoading(true);
		const data = await getIspPlanList(params);
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

	return (
		<>
			{isLoading && currentPage <= 1 ? (
				<CardLoading parentClassName={style.planWrapper} />
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
							<div className={style.planWrapper}>
								{list.map((x, i) => (
									<PlanCard
										key={i}
										item={x}
										isp={isp}
										ispId={ispId}
										showUnassignPlanBtn={x.unassignable_plan}
										reloadData={reloadData}
									/>
								))}
							</div>
						</CustomInfiniteScroll>
					) : (
						<NoPlans />
					)}
				</>
			)}
		</>
	);
}
