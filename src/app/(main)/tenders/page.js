import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import TenderListingTable from "@/components/tender/tenderListingTable"
export const metadata = {
  title: "Tender Listing",
};
export default async function Tenders() {
  const isAllow = await checkPermission("/tenders");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonHeading">
        <h1>Tender Listing</h1>
      </div>
      <TenderListingTable />
    </>
  );
}
