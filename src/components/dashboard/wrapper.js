import SubscriberPlanStats from "./subscriberPlanStats";
import PlanRenewals from "./planRenewals";
import MyPlans from "./myPlans";
import MyWallet from "./myWallet";
import SubscriberStatus from "./subscriberStatus";
import style from "@/css/common/common.module.scss";
import PlanRenewing from "./planRenewing";

export default function DashboardWrapper({ userType }) {
	return (
		<>
			<div className={style.dashwrapperTop}>
				<SubscriberPlanStats userType={userType} />
				{userType == "operator" && <PlanRenewals />}
				{(userType == "isp" || userType == "super isp") && <PlanRenewing />}
				<SubscriberStatus userType={userType} />
			</div>
			<div className={style.dashwrapperbottom}>
				<MyPlans />
				<MyWallet userType={userType} />
			</div>
		</>
	);
}
