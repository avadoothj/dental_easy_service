import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import EditRole from "@/components/roles/edit";
import { getRoleDetails, getMenu } from "@/controllers/role";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const metadata = {
	title: "Edit Role",
};

export default async function EditRolePage({ params }) {
	const session = await getServerSession(options);
	const isAllow = await checkPermission("/roles");
	if (!isAllow) redirect("/");

	const { id } = params;
	const [roleResponse, menuResponse] = await Promise.all([getRoleDetails(id), getMenu()]);

	if (!roleResponse.success) {
		redirect("/roles");
	}
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
					<div className="subscriberName">
						<span>{roleResponse?.data?.name}</span>
					</div>
				</div>
			</div>
			<EditRole
				role={roleResponse.data}
				menuList={menuResponse.menu}
				user={session.user}
			/>
		</>
	);
}
