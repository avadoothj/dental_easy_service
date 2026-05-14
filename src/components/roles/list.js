"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./card";
import NoRole from "./noRole";
import CustomInfiniteScroll from "@/common/customInfiniteScroll";
import CardLoading from "./loading/card";
import { getConstant } from "@/utils/utils";
import style from "@/css/roles/roles.module.scss";
import { getRolesList } from "@/controllers/role";

export default function RoleList({user}) {
  const searchParams = useSearchParams();
  const isFirstSearch = useRef(true);
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const perPageItems = getConstant("ROLE_LIMIT");

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

  const reloadData = () => {
    setCurrentPage(0);
  };

  const handleFetchData = async () => {
    const params = { page_no: currentPage };

    if (searchParams.get("search")) params.search = searchParams.get("search");
    if (searchParams.get("type")) params.type = searchParams.get("type");
    if (searchParams.get("sort")) params.sort = searchParams.get("sort");

    setIsLoading(true);
    const userData = {
      user_type: user.user_type,
      role_id: user.role_id,
    };
    const data = await getRolesList(userData,params);
    setList((list) => {
      if (currentPage == 1) return data.list;
      return [...list, ...data.list];
    });

    setHasMore(data?.list?.length == perPageItems);
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
          {list?.length > 0 ? (
            <CustomInfiniteScroll {...scrollOptions}>
              <div className={style.rolewrapper}>
                {list.map((x, i) => (
                  <Card key={i} item={x} reloadData={reloadData} />
                ))}
              </div>
            </CustomInfiniteScroll>
          ) : (
            <NoRole />
          )}
        </>
      )}
    </>
  );
}
