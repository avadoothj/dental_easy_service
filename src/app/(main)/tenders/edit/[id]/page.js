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
import { formatCategoryData } from "@/utils/utils";
import catJson from "@/utils/categoryJson";

export const metadata = {
  title: "Edit Tender",
};

export default async function Page({ params }) {
  const { id } = params;
  const isAllow = await checkPermission("/tenders");
  if (!isAllow) {
    redirect("/");
  }
  const [response, requiredDoc, sourceTag, financierList] =
    await Promise.all([
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
          <h1>Edit Tender</h1>
          <div className="subscriberName">
            <span>{response.data.teb_number}</span>
          </div>
        </div>
      </div>
      <TenderForm
        categories={categories || []}
        initialData={response.data}
        tenderId={id}
        requiredDoc={requiredDoc}
        sourceTag={sourceTag}
        financierList={financierList}
      />
    </>
  );
}
