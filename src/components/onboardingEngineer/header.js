import { getOnboardingCount } from "@/controllers/onboarding";
import { formatNumber } from "@/utils/utils";

export default async function TeamHeading() {
	const userCount = await getOnboardingCount();

	return (
		<div className="commonHeading">
			<h1>
				Onboarding Engineer <span>({formatNumber(userCount.count)})</span>
			</h1>
		</div>
	);
}
