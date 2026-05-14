import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import BulkWrapper from "@/components/tender-bulk-upload/bulkWrapper";
export const metadata = {
  title: "Tender Bulk Upload",
};
export default async function Page() {
  const isAllow = await checkPermission("/tender-bulk-upload");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonHeading">
        <h1>Bulk Upload</h1>
      </div>
      <BulkWrapper />
    </>
  );
}
