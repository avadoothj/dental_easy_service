import React, { useEffect, useState } from "react";
import Link from "next/link";
import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import { getMyPlans } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import PlansStatusModal from "./plansStatusModal";
import NoRecordsFound from "./noRecordsFound";

export default function MyPlansStatus({ userType }) {
	const planStatus = {
		active: "Active",
		set_price: userType != "super isp" ? "Set Price" : "No Price",
		inactive: "InActive",
	};

	const [planStatusList, SetPlanStatusList] = useState([]);
	const [showMorePlanStatus, SetShowMorePlanStatus] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansStatus = async () => {
		setIsLoading(true);
		const response = await getMyPlans();
		setIsLoading(false);

		if (response.success) {
			SetPlanStatusList(response.data);
		}
	};

	useEffect(() => {
		getPlansStatus();
	}, []);

	const toggleMorePlanStatus = (e) => {
		if (e) e.preventDefault();
		SetShowMorePlanStatus(!showMorePlanStatus);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{planStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th className={style.sno}>S.No.</th>
									<th>Plan Name</th>
									<th className={style.status}>Status</th>
								</tr>
							</thead>
							<tbody>
								{planStatusList.map((item, i) => (
									<tr key={i}>
										<td className={style.sno}>{i + 1}</td>
										<td>{item.bouquet_name}</td>
										<td className={style.statusTd}>
											{item.plan_status == "active" ? (
												<span className={`${style.status} ${style.active}`}>
													{planStatus[item.plan_status]}
												</span>
											) : userType != "super isp" ? (
												<Link
													href={"/plans?search=" + item.bouquet_code}
													className={`${style.status} ${style.setPrice}`}
												>
													{planStatus[item.plan_status]}
												</Link>
											) : (
												<span className={`${style.status}`}>
													{planStatus[item.plan_status]}
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<NoRecordsFound />
					)}
					{planStatusList.length > 0 && (
						<div className={style.viewAllBtn}>
							<a
								href="#"
								onClick={toggleMorePlanStatus}
							>
								View All
							</a>
						</div>
					)}
				</div>
			)}
			<CommonModal
				show={showMorePlanStatus}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleMorePlanStatus}
				animation={false}
			>
				<div className="setsubheader">
					<span>{userType != "super isp" ? "My Plan Status" : "ISP Plan Status"}</span>
					<span
						className="closesetsub"
						onClick={toggleMorePlanStatus}
					></span>
				</div>
				<PlansStatusModal userType={userType} />
			</CommonModal>
		</>
	);
}
