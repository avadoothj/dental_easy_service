"use client";
import { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import CustomDateRangePicker from "@/common/dateRangePicker";
import CustomImage from "@/common/customImage";
import { activationIcon, earningsIcon, myPerformance, renewalIcon } from "@/utils/imagesPicker";
import { currentDate } from "@/utils/dateHelper";
import { getDistributorRetailerPerformance } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import { formatNumber } from "@/utils/utils";

export default function DistributorRetailerPerformance() {
	const today = currentDate();

	const [activationCount, setActivationCount] = useState(0);
	const [renewalsCount, setRenewalsCount] = useState(0);
	const [earningsCount, setEarningsCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const getDistributorRetailerResult = async (fromDate = "2024-10-01", toDate = today) => {
		setIsLoading(true);
		const response = await getDistributorRetailerPerformance(fromDate, toDate);
		setIsLoading(false);

		if (response.success) {
			setActivationCount(response.data.activation);
			setRenewalsCount(response.data.renewals);
			setEarningsCount(response.data.earnings);
		}
	};

	useEffect(() => {
		getDistributorRetailerResult();
	}, []);

	const handleDateChange = (dates) => {
		const [start, end] = dates;
		getDistributorRetailerResult(start, end);
	};

	return (
		<div className={`${style.dashcard}`}>
			<div className={style.heading}>
				<div className={style.headingleft}>
					<span>
						<CustomImage
							alt="performance"
							src={myPerformance}
						/>
					</span>
					My Performance
				</div>
				<div>
					<CustomDateRangePicker
						callback={handleDateChange}
						minDate="2024-10-01"
						maxDate={today}
						value={["2024-10-01", today]}
					/>
				</div>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.perfsection}>
					<div className={style.col1}>
						<div className={style.pericns}>
							<CustomImage
								alt="activation"
								src={activationIcon}
							/>
						</div>
						<div className={style.pertxts}>Activation</div>
						<div className={style.perdig}>{formatNumber(activationCount)}</div>
					</div>
					<div className={style.col2}>
						<div className={style.pericns}>
							<CustomImage
								alt="renewal"
								src={renewalIcon}
							/>
						</div>
						<div className={style.pertxts}>Renewals</div>
						<div className={style.perdig}>{formatNumber(renewalsCount)}</div>
					</div>
					<div className={style.col3}>
						<div className={style.pericns}>
							<CustomImage
								alt="earnings"
								src={earningsIcon}
							/>
						</div>
						<div className={style.pertxts}>Earnings</div>
						<div className={`${style.perdig} ${style.earnings}`}>
							+{formatNumber(earningsCount) ?? 0}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
