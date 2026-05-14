import React, { useEffect, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import { getDistributorRetailerPlansAllocation } from "@/controllers/dashboard";
import DistributorRetailerplanStatusAllocationLoading from "@/components/dashboard/loading/distributorRetailerplanStatusAllocationLoading";
import { formatNumber } from "@/utils/utils";

export default function DistributorRetailerPlansStatusAllocationModal() {

	const [planStatusList, SetPlanStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansStatus = async () => {
		const response = await getDistributorRetailerPlansAllocation(false);
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
						<th>Plan Name</th>
						<th>Assigned</th>
						<th>Unassigned</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<DistributorRetailerplanStatusAllocationLoading />
					) : (
						<>
							{planStatusList.map((item, i) => (
								<tr key={i}>
									<td className={style.sno}>{i + 1}</td>
									<td>{item.bouquet_name}</td>
									<td>{formatNumber(item.assigned)}</td>
									<td>{formatNumber(item.unassigned)}</td>
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
