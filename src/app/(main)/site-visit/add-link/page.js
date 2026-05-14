import CustomImage from "@/components/common/customImage";
import AddLinkForm from "@/components/webPageWatcher/addLinkForm";
import { checkPermission } from "@/controllers/permission";
import Link from "next/link";
import { redirect } from "next/navigation";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

export const metadata = {
  title: "Add Link",
};
export default async function AddLink() {
  const isAllow = await checkPermission("/site-visit");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/site-visit">
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
          <h1>Add Link</h1>
        </div>
      </div>
      <AddLinkForm />
    </>
  );
}
