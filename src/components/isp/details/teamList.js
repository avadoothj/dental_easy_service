"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TeamCard from "./teamCard";
import style from "@/css/team/team.module.scss";
import NoTeam from "@/components/operators/details/noTeam";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "@/components/operators/loading/card";
import { getConstant } from "@/utils/utils";
import { getIspTeamList } from "@/controllers/isp";
import ShowFilterRecordCount from "@/components/common/showFilterRecordCount";

export default function TeamsList({ keyword, status, sort, operator, handleTeamSelect, isp }) {
	const searchParams = useSearchParams();
	const isFirstSearch = useRef(true);

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
		if (isFirstSearch.current) {
			isFirstSearch.current = false;
			return;
		}

		setCurrentPage(0);
	}, [searchParams, keyword, status, sort]);

	const reloadData = () => {
		setCurrentPage(0);
	};

	const handleFetchData = async () => {
		const params = {
			page_no: currentPage,
			search: keyword,
			status: status,
			sort: sort,
			operId: isp.oper_id,
		};

		setIsLoading(true);
		const data = await getIspTeamList(params);

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
						<div className={`${style.teammidd} forOperator`}>
							<div className={style.teamgridbox}>
								<CustomInfiniteScroll {...scrollOptions}>
									<div className={style.innergrid}>
										{list.map((x, i) => (
											<TeamCard
												key={i}
												item={x}
												isp={isp}
												handleTeamSelect={handleTeamSelect}
												reloadData={reloadData}
											/>
										))}
									</div>
								</CustomInfiniteScroll>
							</div>
						</div>
					) : (
						<NoTeam />
					)}
				</>
			)}
		</>
	);
}
