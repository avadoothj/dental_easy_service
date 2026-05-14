"use client";
import React, { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import { getDistributorRetailerPlansAllocation } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import DistributorRetailerPlansStatusAllocationModal from "./distributorRetailerPlansStatusAllocationModal";
import NoRecordsFound from "./noRecordsFound";
import { formatNumber } from "@/utils/utils";

export default function DistributorRetailerPlansAllocation() {
	const [planStatusList, SetPlanStatusList] = useState([]);
	const [showMorePlanStatus, SetShowMorePlanStatus] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const getPlansAllocation = async () => {
		setIsLoading(true);
		const response = await getDistributorRetailerPlansAllocation();
		setIsLoading(false);
		if (response.success) {
			SetPlanStatusList(response.data);
		}
	};

	useEffect(() => {
		getPlansAllocation();
	}, []);

	const toggleMorePlanStatus = (e) => {
		if (e) e.preventDefault();
		SetShowMorePlanStatus(!showMorePlanStatus);
	};
	return (
		<div className={style.dashTable1}>
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
									<th>Assigned</th>
									<th>Unassigned</th>
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								{planStatusList.slice(0, 5).map((item, i) => (
									<tr key={i}>
										<td className={style.sno}>{i + 1}</td>
										<td>{item.bouquet_name}</td>
										<td>{formatNumber(item.assigned)}</td>
										<td>{formatNumber(item.unassigned)}</td>
										<td>{formatNumber(item.total)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<NoRecordsFound />
					)}
					{planStatusList.length > 5 && (
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
					<span>Planwise Allocation</span>
					<span
						className="closesetsub"
						onClick={toggleMorePlanStatus}
					></span>
				</div>
				<DistributorRetailerPlansStatusAllocationModal />
			</CommonModal>
		</div>
	);
}
