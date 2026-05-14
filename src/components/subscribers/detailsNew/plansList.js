"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./planCard";
import PlanCardDisabled from "./planCardDisabled";
// import { getPlansListForActivation } from "@/controllers/plans";
import style from "@/css/subscribers/subscribers.module.scss";
// import NoPlans from "@/components/plans/noPlans";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
// import CardLoading from "@/components/plans/loading/card";
import { getConstant } from "@/utils/utils";

export default function PlanList({
  keyword,
  currentPlanId,
  handlePlanSelect,
  subId,
  excludePlans,
  planSlot,
}) {
  const searchParams = useSearchParams();
  const isFirstSearch = useRef(true);

  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const perPageItems = getConstant("PLANS_LIMIT");

  // useEffect(() => {
  //   if (currentPage > 0) {
  //     handleFetchData();
  //   } else {
  //     setCurrentPage(1);
  //   }
  // }, [currentPage]);

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }

    setCurrentPage(0);
  }, [searchParams, keyword]);

  const reloadData = () => {
    setCurrentPage(0);
  };

  // const handleFetchData = async () => {
  // 	const params = {
  // 		search: keyword,
  // 		subId: subId,
  // 		page_no: currentPage,
  // 	};

  // 	setIsLoading(true);
  // 	const data = await getPlansListForActivation(params);

  // 	setList((list) => {
  // 		if (currentPage == 1) return data;
  // 		return [...list, ...data];
  // 	});

  // 	setHasMore(data.length == perPageItems);
  // 	setIsLoading(false);
  // };

  const scrollOptions = {
    items: list,
    hasMore: hasMore,
    fetchData: () => {
      if (!isLoading) setCurrentPage((number) => parseInt(number) + 1);
    },
  };

  return (
    <>
      {/* {isLoading && currentPage <= 1 ? (
        <CardLoading
          parentClassName={`${style.currentPlanCardWrap} currentPlanWrap`}
        />
      ) : ( */}
      <>
        {list.length > 0 ? (
          <CustomInfiniteScroll {...scrollOptions}>
            <div className={`${style.currentPlanCardWrap} currentPlanWrap`}>
              {list.map((x, i) =>
                excludePlans.includes(x.bouquet_id) ? (
                  <PlanCardDisabled
                    key={i}
                    item={x}
                    reloadData={reloadData}
                    planSlot={planSlot}
                  />
                ) : (
                  <Card
                    key={i}
                    item={x}
                    reloadData={reloadData}
                    currentPlanId={currentPlanId}
                    handlePlanSelect={handlePlanSelect}
                  />
                ),
              )}
            </div>
          </CustomInfiniteScroll>
        ) : // <NoPlans />
        null}
      </>
      {/* )} */}
    </>
  );
}
