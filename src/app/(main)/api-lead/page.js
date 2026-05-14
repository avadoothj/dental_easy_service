import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import LeadList from "@/components/apiLeads/LeadList";

export const metadata = {
  title: "API Leads",
};

export default async function ContractAward() {
  const isAllow = await checkPermission("/api-lead");
  if (!isAllow) {
    redirect("/");
  }

  return (
    <>
      <div className="commonHeading">
        <h1>API Lead</h1>
      </div>
      <LeadList />
    </>
  );
}
