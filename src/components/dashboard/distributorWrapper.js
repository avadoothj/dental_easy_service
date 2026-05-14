//import DistributorRetailerPerformance from "./distributorRetailerPerformance";
//import DistributorRetailerPlans from "./distributorRetailerPlans";
import RetailerPlans from "./retailerPlans";
import CouponStatus from "./couponStatus";
import style from "@/css/common/common.module.scss";
import DistributorRetailerWalletActivity from "./distributorRetailerWalletActivity";
import DistributorRetailerList from "./distributorRetailerList";

export default function DistributorWrapper({ userType }) {
	return (
		<div className={style.ISPDashboard}>
			<div className={style.dashwrapperTop}>
				{/* <DistributorRetailerPerformance /> */}
				<CouponStatus userType={userType} />
				<RetailerPlans userType={userType} />
			</div>
			{/* <div className={`${style.dashwrapperbottom} ${style.singleColumn}`}> */}
			<div className={style.dashwrapperbottom}>
				<DistributorRetailerWalletActivity userType={userType} />
				<DistributorRetailerList />
			</div>
		</div>
	);
}
