import SubscriberPlanStats from "./subscriberPlanStats";
import MyPlans from "./myPlans";
import MyWallet from "./myWallet";
import SubscriberStatus from "./subscriberStatus";
import style from "@/css/common/common.module.scss";

export default function SuperIspWrapper({ userType }) {
	return (
		<div className={style.ISPDashboard}>
			<div className={style.dashwrapperTop}>
				<SubscriberPlanStats userType={userType} />
				<SubscriberStatus userType={userType} />
			</div>
			<div className={style.dashwrapperbottom}>
				<MyWallet userType={userType} />
				<MyPlans userType={userType} />
			</div>
		</div>
	);
}
