"use client";
import CustomImage from "@/components/common/customImage";
import { subscribersDash } from "@/utils/imagesPicker";
import React, { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import { getRetailerList } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import CommonModal from "@/common/commonModal";
import { formatNumber } from "@/utils/utils";
import RetailerListModal from "./retailerListModal";
import NoRecordsFound from "./noRecordsFound";

export default function DistributorRetailerList() {
	const [planStatusList, SetPlanStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showMorePlanStatus, SetShowMorePlanStatus] = useState(false);

	const toggleMorePlanStatus = (e) => {
		if (e) e.preventDefault();
		SetShowMorePlanStatus(!showMorePlanStatus);
	};

	const getPlansStatus = async () => {
		setIsLoading(true);
		const response = await getRetailerList();
		setIsLoading(false);
		if (response.success) {
			SetPlanStatusList(response.data);
		}
	};

	useEffect(() => {
		getPlansStatus();
	}, []);

	return (
		<div className={style.dashcardlist}>
			<div className={style.headingWrap}>
				<h2>
					<CustomImage
						src={subscribersDash}
						alt="subscribersDash"
						width="29"
						height="29"
					/>
					Retailers
				</h2>
			</div>

			<div className={style.dashTable1}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={style.dashTable1}>
						<div className={style.tableWrapper}>
							{planStatusList.length > 0 ? (
								<table>
									<thead>
										<tr>
											<th className={style.sno}>S.No.</th>
											<th>Retailer Name</th>
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
												<td>{item.oper_name}</td>
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
								<span>Retailers</span>
								<span
									className="closesetsub"
									onClick={toggleMorePlanStatus}
								></span>
							</div>
							<RetailerListModal />
						</CommonModal>
					</div>
				)}
			</div>
		</div>
	);
}
