import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import TenderListingTable from "@/components/tender/tenderListingTable";
import CampaignList from "@/components/campaigns/campaignList";

export const metadata = {
  title: "Campaign List",
};

export default async function Campaigns() {
  const isAllow = await checkPermission("/campaigns");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonHeading">
        <h1>Campaign List</h1>
      </div>
      <CampaignList />
    </>
  );
}
