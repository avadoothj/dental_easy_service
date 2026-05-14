import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import ReportList from "@/components/reports/reportList";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const metadata = {
  title: "User Report",
};

export default async function ContractAward() {
  const session = await getServerSession(options);
  const user_id = session?.user?.user_id || null;

  const isAllow = await checkPermission("/report");
  if (!isAllow) {
    redirect("/");
  }

  return (
    <>
      <div className="commonHeading">
        <h1>User Report</h1>
      </div>
      <ReportList user_id={user_id} />
    </>
  );
}
