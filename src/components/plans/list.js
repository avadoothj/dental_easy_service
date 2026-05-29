"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./card";
import { getPlansList } from "@/controllers/plans";
import style from "@/css/plan/plan.module.scss";
import NoPlans from "./noPlans";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "./loading/card";
import { getConstant } from "@/utils/utils";
import CommonModal from "@/common/commonModal";
import SetPlanPrice from "./setPlanPrice";
import SetIspPlanPrice from "./setIspPlanPrice";
import { getOperatorListByIsp } from "@/controllers/partners";
import { getIspListForOperator } from "@/controllers/superIsp";
import ShowFilterRecordCount from "../common/showFilterRecordCount";

export default function PlanList({ userType, userOperId }) {
	const searchParams = useSearchParams();

	const [list, setList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [showPriceModal, setShowPriceModal] = useState(false);
	const [item, setItem] = useState("");
	const [operatorList, setOperatorList] = useState([]);
	const [totalCount, setTotalCount] = useState(-1);
	const [filterCount, setFilterCount] = useState(-1);

	const perPageItems = getConstant("PLANS_LIMIT");

	const togglePriceModal = () => {
		setShowPriceModal(!showPriceModal);
	};

	const getOperatorList = async () => {
		if (userType == "super isp") {
			const list = await getIspListForOperator({ isp_id: userOperId });
			setOperatorList(list.list);
		} else {
			const response = await getOperatorListByIsp();
			if (response.success) {
				const tempArr = [];
				response.list.map((x) => {
					tempArr.push({
						id: x.oper_id,
						label: x.oper_name,
					});
				});
				setOperatorList(tempArr);
			}
		}
	};

	useEffect(() => {
		getOperatorList();
	}, []);

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
		if (searchParams.get("duration")) params.duration = searchParams.get("duration");
		if (searchParams.get("price")) params.price = searchParams.get("price");
		if (searchParams.get("sort")) params.sort = searchParams.get("sort");

		setIsLoading(true);
		const data = await getPlansList(params);

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
									<Card
										key={i}
										item={x}
										togglePriceModal={togglePriceModal}
										setItem={setItem}
									/>
								))}
							</div>
						</CustomInfiniteScroll>
					) : (
						<NoPlans />
					)}
				</>
			)}
			<CommonModal
				show={showPriceModal}
				className="setpricemodel"
				bodyClassName="setpricepad"
				handleClose={togglePriceModal}
				animation={false}
			>
				{userType == "super isp" ? (
					<SetIspPlanPrice
						planDetail={item}
						handleClose={togglePriceModal}
						reloadData={reloadData}
						operatorList={operatorList}
					/>
				) : (
					<SetPlanPrice
						planDetail={item}
						handleClose={togglePriceModal}
						reloadData={reloadData}
						operatorList={operatorList}
					/>
				)}
			</CommonModal>
		</>
	);
}
