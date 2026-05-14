import { getIspCounts } from "@/controllers/isp";
import { formatNumber } from "@/utils/utils";

export default async function IspHeading() {
	const ispCount = await getIspCounts();

	return (
		<div className="commonHeading">
			<h1>
				ISPs <span>({formatNumber(ispCount)})</span>
			</h1>
		</div>
	);
}
