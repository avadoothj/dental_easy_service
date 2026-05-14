import React, { useEffect, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import { getMyPlans } from "@/controllers/dashboard";
import PlanStatusLoading from "@/components/dashboard/loading/planStatusLoading";
import Link from "next/link";

export default function PlansStatusModal({ userType }) {
	const planStatus = {
		active: "Active",
		set_price: userType != "super isp" ? "Set Price" : "No Price",
		inactive: "InActive",
	};

	const [planStatusList, SetPlanStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansStatus = async () => {
		const response = await getMyPlans(false);
		setIsLoading(false);
		if (response.success) {
			SetPlanStatusList(response.data);
		}
	};

	useEffect(() => {
		getPlansStatus();
	}, []);

	return (
		<div className={style.performanceTableWrap}>
			<table>
				<thead>
					<tr>
						<th>S.No.</th>
						<th className={style.planName}>Plan Name</th>
						<th className={style.center}>Status</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<PlanStatusLoading />
					) : (
						<>
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
												className={`${style.status}`}
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
						</>
					)}
				</tbody>
			</table>
		</div>
	);
}
