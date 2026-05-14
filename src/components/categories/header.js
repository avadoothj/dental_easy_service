import { getCategoryCounts } from "@/controllers/category";
import { formatNumber } from "@/utils/utils";

export default async function CategoryHeading() {
	const categoryCount = await getCategoryCounts();

	return (
		<div className="commonHeading catManagement">
			<h1>
				Category Management
				<span> ({formatNumber(categoryCount)})</span>
			</h1>
		</div>
	);
}
