import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import CustomImage from "@/components/common/customImage";
import { mobileBackArrowIcon, webBackArrowIcon } from "@/utils/imagesPicker";
import Link from "next/link";
import AddCategory from "@/components/categories/add";
import { getCategoryActivities } from "@/controllers/category";

export const metadata = {
	title: "Add Category",
};

export default async function AddCategoryPage() {
	const isAllow = await checkPermission("/categories");
	if (!isAllow) redirect("/");

	const [activityList] = await Promise.all([getCategoryActivities()]);

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
					<h1>Add New Category</h1>
				</div>
			</div>

			<AddCategory initialActivityList={activityList} />
		</>
	);
}
