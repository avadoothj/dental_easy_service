import React, { useEffect, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import { getRetailerList } from "@/controllers/dashboard";
import DistributorRetailerplanStatusLoading from "@/components/dashboard/loading/distributorRetailerplanStatusLoading";
import { formatNumber } from "@/utils/utils";

export default function RetailerListModal() {

	const [planStatusList, SetPlanStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansStatus = async () => {
		const response = await getRetailerList(false);
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
						<th>Retailer Name</th>
						<th>Active</th>
						<th>Redeemed</th>
						<th>Expired</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<DistributorRetailerplanStatusLoading />
					) : (
						<>
							{planStatusList.map((item, i) => (
								<tr key={i}>
									<td className={style.sno}>{i + 1}</td>
									<td>{item.oper_name}</td>
									<td>{formatNumber(item.available)}</td>
									<td>{formatNumber(item.redeemed)}</td>
									<td>{formatNumber(item.expired)}</td>
									<td>{formatNumber(item.total)}</td>
								</tr>
							))}
						</>
					)}
				</tbody>
			</table>
		</div>
	);
}
