import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateLeadForm from "@/components/apiLeads/CreateLeadForm";
export const metadata = {
  title: "Generate API",
};
export default async function CreateAPI() {
  const isAllow = await checkPermission("/api-lead");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/api-lead">
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
          <h1>Generate API</h1>
        </div>
      </div>
      <CreateLeadForm />
    </>
  );
}
