import { redirect } from "next/navigation";
import Link from "next/link";

import {
  getTenderQcDetails
} from "@/controllers/tenderQc";
import { getFinancierList, getSourceTag } from "@/controllers/tender";
import { checkPermission } from "@/controllers/permission";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import TenderModificationEditForm from "../../../../components/tenderModification/tenderModificationEditForm";
import { updateTenderModificationData } from "../../../../controllers/tenderModification";
import { getReqDocument } from "../../../../controllers/tender";
import catJson from "@/utils/categoryJson";
import { formatCategoryData } from "@/utils/utils";


export const metadata = {
  title: "Tender Modification",
};

export default async function TenderModificationDetailPage({ params }) {
  const { id } = params;
  const isAllow = await checkPermission("/tender-modification");
  if (!isAllow) redirect("/");
  const [tenderQcResponse, financierList, sourceTag, requiredDoc] =
    await Promise.all([
      getTenderQcDetails(id),
      getFinancierList(),
      getSourceTag(),
      getReqDocument(),
    ]);

  async function updateTenderModification(formData) {
    "use server";
    return await updateTenderModificationData(formData);
  }

  if (!tenderQcResponse.success) {
    redirect("/tender-modification");
  }

  let catData = formatCategoryData(catJson);


  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/tender-modification">
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
          <h1>Tender Modification Page</h1>
          <div className="subscriberName">
            <span>{tenderQcResponse.data.teb_number}</span>
          </div>
        </div>
      </div>
      <TenderModificationEditForm
        tenderDetails={tenderQcResponse.data}
        tenderQcId={id}
        updateTenderModification={updateTenderModification}
        catData={catData}
        financierList={financierList}
        sourceTag={sourceTag}
        requiredDoc={requiredDoc}
      />
    </>
  );
}
