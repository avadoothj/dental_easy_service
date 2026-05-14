"use client";
import style from "@/css/common/dashboard.module.scss";
import { getMyPlansPerformance } from "@/controllers/dashboard";
import { useEffect, useState } from "react";
import SearchFilter from "./searchFilter";
import SearchFilterMobile from "./searchFilterMobile";
import { dashboardPlanActivitySort } from "@/utils/masterData";
import PlanPerformanceLoading from "./loading/planPerformanceLoading";
import { formatNumber } from "@/utils/utils";

export default function PlanPerformanceModal() {
	const [isLoading, setIsLoading] = useState(true);
	const [planPerformanceList, SetPlanPerformanceList] = useState([]);
	const [sortBy, setSortBy] = useState(dashboardPlanActivitySort[0].id);

	useEffect(() => {
		getPlansPerformance();
	}, [sortBy]);

	const getPlansPerformance = async () => {
		setIsLoading(true);
		const response = await getMyPlansPerformance(false, sortBy);
		setIsLoading(false);

		if (response.success) {
			SetPlanPerformanceList(response.data);
		}
	};

	return (
		<>
			<div className={`${style.durationWrap} durationDropdown`}>
				<div className={style.desktopFilter}>
					<SearchFilter
						sortBy={sortBy}
						setSortBy={setSortBy}
						list={dashboardPlanActivitySort}
					/>
				</div>
				<div className="sortbyModal">
					<SearchFilterMobile
						sortBy={sortBy}
						setSortBy={setSortBy}
						list={dashboardPlanActivitySort}
					/>
				</div>
			</div>
			<div className={style.performanceTableWrap}>
				<table>
					<thead>
						<tr>
							<th>S.No.</th>
							<th className={style.planName}>Plan Name</th>
							<th className={style.center}>Activation</th>
							<th className={style.center}>Renewals</th>
							<th className={style.center}>Avg Renewals</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<PlanPerformanceLoading />
						) : (
							<>
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
										<td className={style.center}>{formatNumber(item.avg)}</td>
									</tr>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
