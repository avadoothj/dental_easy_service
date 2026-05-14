import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import TenderApprovalListingTable from "../../../components/tender/tenderApprovalListingTable";

export const metadata = {
  title: "Tender Approve",
};
export default async function Page() {
  const isAllow = await checkPermission("/tender-approve");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonHeading">
        <h1>Pending for Approval Tender</h1>
      </div>
      <TenderApprovalListingTable isAllow={isAllow} />
    </>
  );
}