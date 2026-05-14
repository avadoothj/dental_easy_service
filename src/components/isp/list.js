"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./card";
import style from "@/css/isp/isp.module.scss";
import NoRecords from "./noRecords";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "./loading/card";
import { getConstant } from "@/utils/utils";
import { getAllIspList } from "@/controllers/isp";
import ShowFilterRecordCount from "@/common/showFilterRecordCount";

export default function IspList() {
	const searchParams = useSearchParams();
	const isFirstSearch = useRef(true);

	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(-1);
	const [filterCount, setFilterCount] = useState(-1);

	const perPageItems = getConstant("ISP_LIST_LIMIT");

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
	}, [searchParams]);

	const handleFetchData = async () => {
		const params = { page_no: currentPage };

		if (searchParams.get("search")) params.search = searchParams.get("search");
		if (searchParams.get("category")) params.category = searchParams.get("category");
		if (searchParams.get("zone")) params.zone = searchParams.get("zone");
		if (searchParams.get("sort")) params.sort = searchParams.get("sort");

		setIsLoading(true);
		const data = await getAllIspList(params);
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
				<CardLoading />
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
							<div className={style.teamgridbox}>
								<div className={style.innergrid}>
									{list.map((x, i) => (
										<Card
											key={i}
											item={x}
										/>
									))}
								</div>
							</div>
						</CustomInfiniteScroll>
					) : (
						<NoRecords />
					)}
				</>
			)}
		</>
	);
}
