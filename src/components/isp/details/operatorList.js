"use client";
import { useEffect, useRef, useState } from "react";
import OperatorCard from "./operatorCard";
import style from "@/css/operator/operator.module.scss";
import NoRecords from "../noRecords";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "@/components/operators/loading/card";
import { getConstant } from "@/utils/utils";
import { getOperatorsListForIsp } from "@/controllers/isp";
import ShowFilterRecordCount from "@/components/common/showFilterRecordCount";

export default function OperatorList({ isp, user, search, status, sortBy }) {
	const isFirstSearch = useRef(true);

	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(-1);
	const [filterCount, setFilterCount] = useState(-1);

	const perPageItems = getConstant("OPERATOR_LIMIT");

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
	}, [search, status, sortBy]);

	const handleFetchData = async () => {
		const params = {
			page_no: currentPage,
			isp_id: isp.oper_id,
			search: search,
			status: status,
			sort: sortBy,
			operId: isp.oper_id,
		};

		setIsLoading(true);
		const data = await getOperatorsListForIsp(params);
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
				<div className={style.operatorGridWrap}>
					<CardLoading />
				</div>
			) : (
				<>
					{filterCount >= 0 && (
						<ShowFilterRecordCount
							filterCount={filterCount}
							totalCount={totalCount}
						/>
					)}
					<>
						{list.length > 0 ? (
							<CustomInfiniteScroll {...scrollOptions}>
								<div className={style.operatorGridWrap}>
									<div className={style.innerGrid}>
										{list.map((x, i) => (
											<OperatorCard
												key={i}
												item={x}
												user={user}
											/>
										))}
									</div>
								</div>
							</CustomInfiniteScroll>
						) : (
							<>
								<NoRecords noPadding={true} />
							</>
						)}
					</>
				</>
			)}
		</>
	);
}
