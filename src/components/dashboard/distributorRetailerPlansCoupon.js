"use client";
import React, { useState } from "react";
import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import DistributorRetailerPlansStatusModal from "./distributorRetailerPlansStatusModal";
import NoRecordsFound from "./noRecordsFound";
import { formatNumber } from "@/utils/utils";

export default function DistributorRetailerPlansCoupon({ planStatusList }) {
	const [showMorePlanStatus, SetShowMorePlanStatus] = useState(false);

	const toggleMorePlanStatus = (e) => {
		if (e) e.preventDefault();
		SetShowMorePlanStatus(!showMorePlanStatus);
	};
	return (
		<div className={style.dashTable1}>
			<div className={style.tableWrapper}>
				{planStatusList.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th className={style.sno}>S.No.</th>
								<th>Plan Name</th>
								<th>Active</th>
								<th>Redeemed</th>
								<th>Expired</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{planStatusList.slice(0, 5).map((item, i) => (
								<tr key={i}>
									<td className={style.sno}>{i + 1}</td>
									<td>{item.bouquet_name}</td>
									<td>{formatNumber(item.available)}</td>
									<td>{formatNumber(item.redeemed)}</td>
									<td>{formatNumber(item.expired)}</td>
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
			<CommonModal
				show={showMorePlanStatus}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleMorePlanStatus}
				animation={false}
			>
				<div className="setsubheader">
					<span>Planwise Coupons</span>
					<span
						className="closesetsub"
						onClick={toggleMorePlanStatus}
					></span>
				</div>
				<DistributorRetailerPlansStatusModal />
			</CommonModal>
		</div>
	);
}
