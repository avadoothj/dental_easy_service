import CustomImage from "@/common/customImage";
import { getPlanCounts } from "@/controllers/plans";
import { errorIconYellow } from "@/utils/imagesPicker";
import { formatNumber } from "@/utils/utils";

export default async function PlanHeading() {
	const counts = await getPlanCounts();

	return (
		<div className="commonHeading">
			<h1>
				Plans <span>({formatNumber(counts.total)})</span>
			</h1>
			{counts.price_not_set > 0 && (
				<div className="notseticn">
					<span>
						<CustomImage
							alt="error"
							src={errorIconYellow}
							width="16"
							height="16"
						/>
					</span>
					&nbsp;Price not set for {counts.price_not_set}/{counts.total} plans
				</div>
			)}
		</div>
	);
}
