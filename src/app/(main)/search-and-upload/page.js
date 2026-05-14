import React from "react";
import AdvanceSearchTable from "../../../components/advanceSearch/advanceSearchTable";
import { getFinancierList } from "@/controllers/tender";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import catJson from "@/utils/categoryJson";
import { formatCategoryData } from "@/utils/utils";

export default async function Page() {
  const isAllow = await checkPermission("/search-and-upload");
  if (!isAllow) redirect("/");
  const [financierList] = await Promise.all([getFinancierList()]);

  let catData = formatCategoryData(catJson);
  return (
    <>
      <div className="commonHeading">
        <h1>Advance Search</h1>
      </div>
      <AdvanceSearchTable financierList={financierList} categories={catData} />
    </>
  );
}
