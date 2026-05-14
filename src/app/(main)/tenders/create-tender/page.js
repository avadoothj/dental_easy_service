import React from "react";
import TenderForm from "@/components/tender/tenderForm";
import {
  getFinancierList,
  getReqDocument,
  getSourceTag,
} from "@/controllers/tender";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import Link from "next/link";
import catJson from "@/utils/categoryJson";
import { formatCategoryData } from "@/utils/utils";
export const metadata = {
  title: "Create Tender",
};
export default async function AddTender() {
  const isAllow = await checkPermission("/tenders");
  if (!isAllow) redirect("/");
  const [requiredDoc, sourceTag, financierList] = await Promise.all([
    getReqDocument(),
    getSourceTag(),
    getFinancierList(),
  ]);
  let catData = formatCategoryData(catJson);
  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/tenders">
            <CustomImage
              src={webBackArrowIcon}
              className="web"
              width="20"
              height="18"
            />
            <CustomImage
              src={mobileBackArrowIcon}
              className="mweb"
              width="9"
              height="15"
            />
          </Link>
          <h1>Add Tender</h1>
        </div>
      </div>
      <TenderForm
        categories={catData}
        initialData={null}
        tenderId={""}
        isAllow={false}
        requiredDoc={requiredDoc}
        sourceTag={sourceTag}
        financierList={financierList}
      />
    </>
  );
}
