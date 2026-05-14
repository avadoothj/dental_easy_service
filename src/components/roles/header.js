import { getRoleCounts } from "@/controllers/role";
import { formatNumber } from "@/utils/utils";

export default async function RoleHeading() {
	const roleCount = await getRoleCounts();
	return (
		<div className="commonHeading">
			<h1>
				Role Management <span>({formatNumber(roleCount?.count)})</span>
			</h1>
		</div>
	);
}
