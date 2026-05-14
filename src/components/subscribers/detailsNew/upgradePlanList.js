"use client";
import style from "@/css/subscribers/subscribers.module.scss";
import { getConstant } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
// import { getPlansListForUpgrade } from "@/controllers/plans";
import CustomInfiniteScroll from "@/components/common/customInfiniteScroll";
// import NoPlans from "@/components/plans/noPlans";
import UpgradePlanCard from "./upgradePlanCard";
import { useEffect, useRef, useState } from "react";
// import CardLoading from "@/components/plans/loading/card";

export default function UpgradePlanList({
  toggleUpgradePlanBtn,
  keyword,
  planSlot,
  currentPlanId,
  handleUpgradePlanSelect,
  subId,
}) {
  const isFirstSearch = useRef(true);

  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
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
  }, [searchParams, keyword]);

  const reloadData = () => {
    setCurrentPage(0);
  };

  //   const handleFetchData = async () => {
  //     const params = {
  //       search: keyword,
  //       currentPlanId: currentPlanId,
  //       subId: subId,
  //       page_no: currentPage,
  //       plan_slot: planSlot,
  //     };

  //     setIsLoading(true);
  //     const data = await getPlansListForUpgrade(params);

  //     setList((list) => {
  //       if (currentPage == 1) return data;
  //       return [...list, ...data];
  //     });

  //     setHasMore(data.length == perPageItems);
  //     setIsLoading(false);
  //   };

  const scrollOptions = {
    items: list,
    hasMore: hasMore,
    fetchData: () => {
      if (!isLoading) setCurrentPage((number) => parseInt(number) + 1);
    },
  };

  return (
    <>
      <div className={style.subsPlanTable}>
        <div className={style.plantableSec}>
          {/* {isLoading && currentPage <= 1 ? (
            <CardLoading parentClassName={`${style.currentPlanCardWrap}`} />
          ) : ( */}
          <>
            {list.length > 0 ? (
              <CustomInfiniteScroll {...scrollOptions}>
                <div className={`${style.currentPlanCardWrap} currentPlanWrap`}>
                  {list.map((x, i) => (
                    <UpgradePlanCard
                      key={i}
                      item={x}
                      reloadData={reloadData}
                      currentPlanId={currentPlanId}
                      handleUpgradePlanSelect={handleUpgradePlanSelect}
                    />
                  ))}
                </div>
              </CustomInfiniteScroll>
            ) : (
              <NoPlans />
            )}
          </>
          {/* )} */}
        </div>
        <div className={style.plantableSec}>
          <div className={style.plantableSec}>
            <div className={`${style.planRow1} ${style.startDateRow}`}>
              <>
                <div className={style.col}>&nbsp;</div>
                <div className={style.col}>&nbsp;</div>
              </>
              <div className={style.btnWrapper2}>
                <button
                  type="button"
                  className="commonBtn borderBtn"
                  onClick={toggleUpgradePlanBtn}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
