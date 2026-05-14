import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import CustomImage from "@/components/common/customImage";
import { mobileBackArrowIcon, webBackArrowIcon } from "@/utils/imagesPicker";
import Link from "next/link";
import AddNew from "@/components/sender/addNew";

export const metadata = {
  title: "Add Sender",
};

export default async function AddSender() {
  const isAllow = await checkPermission("/senders");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/categories">
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
          <h1>Add New Sender</h1>
        </div>
      </div>

      <AddNew />
    </>
  );
}
