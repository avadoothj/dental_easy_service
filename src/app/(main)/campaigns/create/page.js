import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import CustomImage from "@/components/common/customImage";
import { mobileBackArrowIcon, webBackArrowIcon } from "@/utils/imagesPicker";
import Link from "next/link";
import CampaignCreate from "@/components/campaigns/createCompaign";

export const metadata = {
  title: "Add Campaign",
};

export default async function CampaignCreatePage() {
  const isAllow = await checkPermission("/campaigns");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/campaigns">
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
          <h1>Add Campaign</h1>
        </div>
      </div>

      <CampaignCreate />
    </>
  );
}
