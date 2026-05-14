"use client";
import style from "@/css/common/dashboard.module.scss";
import { getIspWiseStatus } from "@/controllers/dashboard";
import { useEffect, useState } from "react";
import SearchFilter from "./searchFilter";
import SearchFilterMobile from "./searchFilterMobile";
import { dashboardOperatorListSort } from "@/utils/masterData";
import ViewByOperatorLoading from "./loading/viewByOperatorLoading";

export default function ViewByIspModal() {
	const [isLoading, setIsLoading] = useState(true);
	const [subscriberCountByIsp, SetSubscriberCountByIsp] = useState([]);
	const [sortBy, setSortBy] = useState(dashboardOperatorListSort[0].id);

	useEffect(() => {
		getPlansPerformance();
	}, [sortBy]);

	const getPlansPerformance = async () => {
		setIsLoading(true);
		const response = await getIspWiseStatus(sortBy);
		setIsLoading(false);

		if (response.success) {
			SetSubscriberCountByIsp(response.data);
		}
	};

	return (
		<>
			<div className={`${style.durationWrap} durationDropdown`}>
				<div className={style.desktopFilter}>
					<SearchFilter
						sortBy={sortBy}
						setSortBy={setSortBy}
						list={dashboardOperatorListSort}
					/>
				</div>
				<div className="sortbyModal">
					<SearchFilterMobile
						sortBy={sortBy}
						setSortBy={setSortBy}
						list={dashboardOperatorListSort}
					/>
				</div>
			</div>

			<div className={style.performanceTableWrap}>
				<table>
					<thead>
						<tr>
							<th>ISP</th>
							<th className={style.planName}>Total</th>
							<th className={style.center}>Active</th>
							<th className={style.center}>Inactive</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<ViewByOperatorLoading />
						) : (
							<>
								{subscriberCountByIsp.map((item, i) => (
									<tr key={i}>
										<td className={style.sno}>{item.oper_name}</td>
										<td>{item.total}</td>
										<td className={style.center}>{item.active}</td>
										<td className={style.center}>{item.inactive}</td>
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
