"use client";
import { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import CustomDateRangePicker from "@/common/dateRangePicker";
import CustomImage from "@/common/customImage";
import { activationIcon, expiryIcon, myPerformance, renewalIcon } from "@/utils/imagesPicker";
import { currentDate } from "@/utils/dateHelper";
import { getSubscriberPlanStats, getActivationStatus } from "@/controllers/dashboard";
import Loader from "@/components/common/loader";
import CommonModal from "@/common/commonModal";
import ActivationModal from "./activationModal";
import { getCookie, setCookie } from "@/utils/utils";

export default function SubscriberPlanStats({ userType }) {
	const today = currentDate();

	const [activationCount, setActivationCount] = useState(0);
	const [renewalsCount, setRenewalsCount] = useState(0);
	const [expiredCount, setExpiredCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [viewOperatorList, setViewOperatorList] = useState(false);

	useEffect(() => {
		if (userType == "ispTemp" && !getCookie("activation_status")) {
			getActivation();
		}
	}, []);

	const getActivation = async () => {
		const response = await getActivationStatus();

		if (response.success) {
			setCookie(
				"activation_status",
				JSON.stringify({
					primary: response.data.active,
					secondary: response.data.loggedIn,
					tertiary: response.data.mediaPlay,
				}),
				6 * 30
			);
		}
	};

	const getSubscriberStatusResult = async (fromDate = today, toDate = today) => {
		setIsLoading(true);
		const response = await getSubscriberPlanStats(fromDate, toDate);
		setIsLoading(false);

		if (response.success) {
			setActivationCount(response.data.activation);
			setRenewalsCount(response.data.renewals);
			setExpiredCount(response.data.expired);
		}
	};

	const toggleViewByOperatorModal = () => {
		setViewOperatorList(!viewOperatorList);
	};

	useEffect(() => {
		getSubscriberStatusResult();
	}, []);

	const handleDateChange = (dates) => {
		const [start, end] = dates;
		getSubscriberStatusResult(start, end);
	};

	return (
		<>
			<div className={`${style.dashcard}`}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								alt="performance"
								src={myPerformance}
							/>
						</span>
						{userType == "super isp" ? "ISP Performance" : "My Performance"}
					</div>
					<div>
						<CustomDateRangePicker
							callback={handleDateChange}
							maxDate={today}
						/>
					</div>
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div className={style.perfsection}>
						{userType == "ispTemp" ? (
							<div
								className={style.col1}
								onClick={toggleViewByOperatorModal}
								style={{ cursor: `pointer` }}
							>
								<div className={style.pericns}>
									<CustomImage
										alt="activation"
										src={activationIcon}
									/>
								</div>
								<div className={style.pertxts}>Activation</div>
								<div className={style.perdig}>{activationCount}</div>
							</div>
						) : (
							<div className={style.col1}>
								<div className={style.pericns}>
									<CustomImage
										alt="activation"
										src={activationIcon}
									/>
								</div>
								<div className={style.pertxts}>Activation</div>
								<div className={style.perdig}>{activationCount}</div>
							</div>
						)}

						<div className={style.col2}>
							<div className={style.pericns}>
								<CustomImage
									alt="renewal"
									src={renewalIcon}
								/>
							</div>
							<div className={style.pertxts}>Renewals</div>
							<div className={style.perdig}>{renewalsCount}</div>
						</div>
						<div className={style.col3}>
							<div className={style.pericns}>
								<CustomImage
									alt="expired"
									src={expiryIcon}
								/>
							</div>
							<div className={style.pertxts}>Expired</div>
							<div className={style.perdig}>{expiredCount}</div>
						</div>
					</div>
				)}
			</div>
			<CommonModal
				show={viewOperatorList}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleViewByOperatorModal}
				animation={false}
			>
				<div className="setsubheader">
					<span>Activation</span>
					<span
						className="closesetsub"
						onClick={toggleViewByOperatorModal}
					></span>
				</div>
				<ActivationModal toggleViewByOperatorModal={toggleViewByOperatorModal} />
			</CommonModal>
		</>
	);
}
