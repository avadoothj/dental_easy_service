import { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import PlanPerformanceModal from "./planPerformanceModal";
import { getMyPlansPerformance } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import NoRecordsFound from "./noRecordsFound";
import { formatNumber } from "@/utils/utils";

export default function MyPlansPerformance({ userType }) {
	const [showMorePlans, setShowMorePlans] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [planPerformanceList, setPlanPerformanceList] = useState([]);

	const getPlansPerformance = async () => {
		setIsLoading(true);
		const response = await getMyPlansPerformance();
		setIsLoading(false);

		if (response.success) {
			setPlanPerformanceList(response.data);
		}
	};

	useEffect(() => {
		getPlansPerformance();
	}, []);

	const showMorePlan = (e) => {
		if (e) e.preventDefault();
		setShowMorePlans(!showMorePlans);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className={style.tableWrapper}>
						{planPerformanceList.length > 0 ? (
							<table>
								<thead>
									<tr>
										<th className={style.sno}>S.No.</th>
										<th className={style.planName}>Plan Name</th>
										<th className={style.center}>Activation</th>
										<th className={style.center}>Renewals</th>
										<th className={style.noWrapCenter}>Avg Renewals</th>
									</tr>
								</thead>
								<tbody>
									{planPerformanceList.map((item, i) => (
										<tr key={i}>
											<td className={style.sno}>{i + 1}</td>
											<td>{item.bouquet_name}</td>
											<td className={style.center}>
												{formatNumber(item.activation)}
											</td>
											<td className={style.center}>
												{formatNumber(item.renewals)}
											</td>
											<td className={style.center}>
												{formatNumber(item.avg)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<NoRecordsFound />
						)}
					</div>
					{planPerformanceList.length > 0 && (
						<div className={style.viewAllBtn}>
							<a
								href="#"
								onClick={showMorePlan}
							>
								View All
							</a>
						</div>
					)}
				</>
			)}

			<CommonModal
				show={showMorePlans}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={showMorePlan}
				animation={false}
			>
				<div className="setsubheader">
					<span>
						{userType != "super isp" ? "My Plan Performance" : "ISP Plan Performance"}
					</span>
					<span
						className="closesetsub"
						onClick={showMorePlan}
					></span>
				</div>
				<PlanPerformanceModal showMorePlan={showMorePlan} />
			</CommonModal>
		</>
	);
}
