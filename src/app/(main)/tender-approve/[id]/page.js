import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import TenderForm from "@/components/tender/tenderForm";
import {
  getReqDocument,
  getSourceTag,
  getTenderById,
  getFinancierList,
} from "@/controllers/tender";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import { checkPermission } from "@/controllers/permission";
import catJson from "@/utils/categoryJson";
import { formatCategoryData } from "@/utils/utils";

export const metadata = {
  title: "Tender Approve",
};

export default async function Page({ params }) {
  const { id } = params;
  const isAllow = await checkPermission("/tender-approve");
  if (!isAllow) redirect("/");
  const [response, requiredDoc, sourceTag, financierList] = await Promise.all([
    getTenderById(id),
    getReqDocument(),
    getSourceTag(),
    getFinancierList(),
  ]);

  let categories = formatCategoryData(catJson);

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/tender-approve">
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
          <h1>Tender Approve</h1>
        </div>
      </div>
      <TenderForm
        categories={categories || []}
        initialData={response.data}
        tenderId={id}
        isAllow={isAllow}
        requiredDoc={requiredDoc}
        sourceTag={sourceTag}
        financierList={financierList}
      />
    </>
  );
}
