import Link from "next/link";
import commonStyle from "@/css/common/common.module.scss";
import { checkPermission } from "@/controllers/permission";

export default async function DefaultDashboard() {
	return (
		<div className={commonStyle.DashboardNoResult}>
			<div className={commonStyle.inner}>
				<h3>Welcome to Dental Easy Services CMS</h3>
				{/* <p>
					Unlock the power to effortlessly manage your plans, subscribers, and the entire
					ecosystem in one centralized portal. From seamless plan updates to efficient
					partner collaboration, we've got you covered.
				</p> */}
			</div>
		</div>
	);
}
