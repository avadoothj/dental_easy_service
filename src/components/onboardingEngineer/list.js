"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./card";
import NoTeam from "./noTeam";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "./loading/card";
import { getConstant } from "@/utils/utils";
import style from "@/css/team/team.module.scss";
import ShowFilterRecordCount from "@/components/common/showFilterRecordCount";
import { getFieldEngineerList } from "../../controllers/onboarding";

export default function TeamList() {
	const searchParams = useSearchParams();

	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(-1);
	const [filterCount, setFilterCount] = useState(-1);

	const perPageItems = getConstant("TEAM_LIMIT");

	useEffect(() => {
		if (currentPage > 0) {
			handleFetchData();
		} else {
			setCurrentPage(1);
		}
	}, [currentPage]);

	useEffect(() => {
		setCurrentPage(0);
	}, [searchParams]);

	const reloadData = () => {
		setCurrentPage(0);
	};

	const handleFetchData = async () => {
		const params = { page_no: currentPage };

		if (searchParams.get("search")) params.search = searchParams.get("search");
		if (searchParams.get("role")) params.role = searchParams.get("role");
		if (searchParams.get("status")) params.status = searchParams.get("status");
		if (searchParams.get("sort")) params.sort = searchParams.get("sort");

		setIsLoading(true);
		const data = await getFieldEngineerList(params);
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

	console.log("list :", list);
	return (
		<>
			{isLoading && currentPage <= 1 ? (
				<CardLoading />
			) : (
				<div className={style.teammidd}>
					{filterCount >= 0 && (
						<ShowFilterRecordCount
							filterCount={filterCount}
							totalCount={totalCount}
						/>
					)}
					<div className={style.teamgridbox}>
						{list.length > 0 ? (
							<CustomInfiniteScroll {...scrollOptions}>
								<div className={style.innergrid}>
									{list.map((x, i) => (
										<Card
											key={i}
											item={x}
											reloadData={reloadData}
										/>
									))}
								</div>
							</CustomInfiniteScroll>
						) : (
							<NoTeam />
						)}
					</div>
				</div>
			)}
		</>
	);
}
