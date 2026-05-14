import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import AddRole from "@/components/roles/add";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import { getMenu } from "@/controllers/role";

export const metadata = {
	title: "Add Role",
};

export default async function AddRolePage() {
	const isAllow = await checkPermission("/roles");
	if (!isAllow) redirect("/");

	const [menuResponse] = await Promise.all([getMenu()]);

	return (
		<>
			<div className="commonBackHeading">
				<div className="headingWrap">
					<Link href="/roles">
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
					<h1>Role Management</h1>
				</div>
			</div>
			<AddRole menuList={menuResponse.menu} />
		</>
	);
}
