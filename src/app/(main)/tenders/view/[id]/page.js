import React from "react";
import TenderView from "../../../../../components/tender/tenderView";
import CustomImage from "@/common/customImage";
import { checkPermission } from "@/controllers/permission";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import { getTenderById } from "@/controllers/tender";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "View Tender",
};
export default async function Page({params}) {
  const { id } = params;
  const isAllow = await checkPermission("/tenders");
  if(!isAllow) redirect('/')
  const [response] = await Promise.all([getTenderById(id)]);
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
          <h1>View Tender</h1>
          <div className="subscriberName">
            <span>{response?.data?.teb_number}</span>
          </div>
        </div>
      </div>
      <TenderView data={response.data} />
    </>
  );
}
