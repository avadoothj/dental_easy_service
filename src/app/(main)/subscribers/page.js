import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import NoSubscribers from "@/components/subscribers/noSubscribers";
import SubscriberList from "@/components/subscribers/list";
import SearchFilter from "@/components/subscribers/searchFilter";
import SearchFilterMobile from "@/components/subscribers/searchFilterMobile";
import { getSubscribersCount } from "@/controllers/subscribers";
import { formatNumber } from "@/utils/utils";

export const metadata = {
  title: "Subscribers",
};

export default async function Subscribers() {
  const subscriberCount = 0;
  const isAllow = await checkPermission("/subscribers");
  if (!isAllow) redirect("/");

  //   const [isAllowBulk, subscriberCount] = await Promise.all([
  //     checkPermission("/bulkActivity"),
  //     // getSubscribersCount(),
  //   ]);

  return (
    <>
      <div className="commonHeading">
        <h1>
          Subscribers <span>({formatNumber(subscriberCount)})</span>
        </h1>
      </div>
      {/* {subscriberCount > 0 ? ( */}
      <>
        <SearchFilter />
        <SearchFilterMobile />
        <SubscriberList />
      </>
      {/* ) : (
        <NoSubscribers isAllowBulk={false} />
        // <NoSubscribers isAllowBulk={isAllowBulk} />
      )} */}
    </>
  );
}
