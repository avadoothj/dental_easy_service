"use client";
import { useContext, useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./card";
import { getSubscribersList } from "@/controllers/subscribers";
import style from "@/css/subscribers/subscribers.module.scss";
import NoRecords from "./noRecords";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "./loading/card";
import { getConstant } from "@/utils/utils";
import { AppContext } from "@/contextProvider";
import ShowFilterRecordCount from "@/components/common/showFilterRecordCount";
import { getPlan } from "../../controllers/subscribers";

export default function SubscriberList() {
  const searchParams = useSearchParams();
  const { user } = useContext(AppContext);
  const isFirstSearch = useRef(true);

  const [list, setList] = useState([]);
  const [plans, setPlans] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(-1);
  const [filterCount, setFilterCount] = useState(-1);

  const perPageItems = getConstant("SUBSCRIBER_LIMIT");

  useEffect(() => {
    getPlan()
      .then((res) => {
        setPlans(res.docs || []);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
      });
  }, []);

  const planMap = useMemo(() => {
    const map = {};
    plans.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [plans]);

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
    if (searchParams.get("status")) params.status = searchParams.get("status");
    if (searchParams.get("sort")) params.sort = searchParams.get("sort");

    setIsLoading(true);
    const data = await getSubscribersList(params);

    setList((list) => {
      if (currentPage == 1) return data.docs;
      return [...list, ...data.docs];
    });

    if (currentPage == 1) {
      setTotalCount(data.totalDocs ?? -1);
      setFilterCount(data.filter ?? -1);
    }

    setHasMore(data.docs.length == perPageItems);
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
        <CardLoading userType={user?.user_type} />
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
                      userType={user?.user_type}
                      planMap={planMap}
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
