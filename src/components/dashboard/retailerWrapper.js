import DistributorRetailerPerformance from "./distributorRetailerPerformance";
import DistributorRetailerPlans from "./distributorRetailerPlans";
import CouponStatus from "./couponStatus";
import style from "@/css/common/common.module.scss";
import DistributorRetailerWalletActivity from "./distributorRetailerWalletActivity";

export default function RetailerWrapper({ userType }) {
	return (
		<div className={style.ISPDashboard}>
			<div className={style.dashwrapperTop}>
				<DistributorRetailerPerformance />
				<CouponStatus userType={userType} />
			</div>
			{/* <div className={`${style.dashwrapperbottom} ${style.singleColumn}`}> */}
			<div className={style.dashwrapperbottom}>
				<DistributorRetailerWalletActivity userType={userType} />
				<DistributorRetailerPlans userType={userType} />
			</div>
		</div>
	);
}
