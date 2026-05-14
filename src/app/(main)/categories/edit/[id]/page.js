import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import EditCategory from "@/components/categories/edit";
import { getCategoryDetails, getCategoryActivities } from "@/controllers/category";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

export const metadata = {
	title: "Edit Category",
};

export default async function CategoryDetailsPage({ params }) {
	const isAllow = await checkPermission("/categories");
	if (!isAllow) redirect("/");

	const { id } = params;
	const [catDetails, activityList] = await Promise.all([
		getCategoryDetails(id),
		getCategoryActivities(),
	]);

	if (!catDetails.success) {
		redirect("/categories");
	}

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
					<h1>Category Management</h1>
					<div className="subscriberName">
						<span>{catDetails.data.name}</span>
					</div>
				</div>
			</div>
			<EditCategory
				catDetails={catDetails.data}
				initialActivityList={activityList}
			/>
		</>
	);
}
