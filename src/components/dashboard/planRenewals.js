"use client";
import { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import DoughnutChart from "@/components/graphs/doughnutChart";
import { getPlanRenewals, getRenewalIntentCount, getAutoRenewalIntentCount } from "@/controllers/dashboard";
import CommonModal from "@/common/commonModal";
import PlansRenewingModal from "./plansRenewingModal";
import CustomImage from "@/components/common/customImage";
import { planRenewing, bellIcon, addSubscriberImage } from "@/utils/imagesPicker";
import { currentDate } from "@/utils/dateHelper";
import { arrayUnique, formatDate, getConstant } from "@/utils/utils";
import Loader from "@/components/common/loader";
import moment from "moment-timezone";
import PlanRenewNotificationList from "./planRenewNotificationList";

export default function PlanRenewals() {
	const noOfDays = getConstant("PLAN_RENEWING_DAYS");

	const colorCodeList = [["#7c45ab", "#5e44be", "#4e40be"], ["#d0d0dc"]];

	const [isLoading, setIsLoading] = useState(true);
	const [width, setWidth] = useState("300");
	const [height, setHeight] = useState("152");
	const [showViewSubscriberBtn, setShowViewSubscriberBtn] = useState(false);
	const [showViewSubscriber, setShowViewSubscriber] = useState(false);
	const [showRenewNotification, setShowRenewNotification] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [originalData, setOriginalData] = useState([]);
	const [showDate, setShowDate] = useState(currentDate());
	const [renewingCount, setRenewingCount] = useState(0);
	const [totalExpiringCount, setTotalExpiringCount] = useState(0);
	const [hasRenewalIntent, setHasRenewalIntent] = useState(false);
	const [hasAutoRenewalIntent, setHasAutoRenewalIntent] = useState(false);
	const [renewalIntentList, setRenewalIntentList] = useState([]);
	const [uniqueDateList, setUniqueDateList] = useState([]);
	const [daysList, setDaysList] = useState([]);

	useEffect(() => {
		if (document.body.clientWidth < 400) {
			setWidth("221");
			setHeight("113");
		}
		plansRenewalsCount();
		renewalIntent();
		autoRenewalIntent();
	}, []);

	const toggleViewMoreRenewals = async () => {
		setShowViewSubscriber(!showViewSubscriber);
	};

	const toggleRenewNotification = async () => {
		setShowRenewNotification(!showRenewNotification);
	};

	const plansRenewalsCount = async () => {
		setIsLoading(true);
		const response = await getPlanRenewals(noOfDays);
		setIsLoading(false);

		if (response.success) {
			if (response.data.length > 0) {
				response.data.map((x) => {
					if (x.expiring) setShowViewSubscriberBtn(true);
				});

				const list = [];

				for (let index = 0; index < noOfDays; index++) {
					const checkDate = moment().add(index, "day").format("YYYY-MM-DD");
					const dateItem = response.data.filter((x) => x.date == checkDate);

					let temp = { total: 0, date: checkDate };
					if (dateItem) {
						temp = { ...temp, ...dateItem[0] };
					}

					list.push(temp);
				}

				setDaysList(arrayUnique(list.map((x) => x.date)));
				setOriginalData(list);
				setShowDate(list[0].date);
				setRenewingCount(list[0].renewing);
				setTotalExpiringCount(list[0].total);
			}
		}
	};

	const renewalIntent = async () => {
		const response = await getRenewalIntentCount();
		if (response.success && response.hasRenewalIntent) {
			setHasRenewalIntent(true);
		}
	};

	const autoRenewalIntent = async () => {
		const response = await getAutoRenewalIntentCount();
		if (response.success && response.hasAutoRenewalIntent) {
			setHasAutoRenewalIntent(true);
		}
	};

	const showPrevRecord = (e) => {
		e.preventDefault();

		if (currentIndex > 0) {
			const newIndex = currentIndex - 1;
			const newData = originalData.filter((x) => x.date == daysList[newIndex]);

			setShowDate(newData[0].date);
			setRenewingCount(newData[0].renewing);
			setTotalExpiringCount(newData[0].total);
			setCurrentIndex(newIndex);

			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
			}, 200);
		}
	};

	const showNextRecord = (e) => {
		e.preventDefault();

		if (currentIndex < daysList.length - 1) {
			const newIndex = currentIndex + 1;
			const newData = originalData.filter((x) => x.date == daysList[newIndex]);

			setShowDate(newData[0].date);
			setRenewingCount(newData[0].renewing);
			setTotalExpiringCount(newData[0].total);
			setCurrentIndex(newIndex);

			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
			}, 200);
		}
	};

	return (
		<>
			<div className={`${style.dashcard} ${style.ISPrenval}`}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								src={planRenewing}
								alt="plan renewing"
								width="29"
								height="29"
							/>
						</span>
						Plan Renewing
						{(hasRenewalIntent || hasAutoRenewalIntent) && (
							<i
								className={style.bell}
								onClick={toggleRenewNotification}
							>
								<CustomImage
									src={bellIcon}
									alt="bellIcon"
									width="22"
									height="20"
								/>
							</i>
						)}
					</div>
					{!(isLoading && originalData.length == 0) && showViewSubscriberBtn && (
						<button
							className={style.btndash}
							onClick={toggleViewMoreRenewals}
						>
							View Subscriber
						</button>
					)}
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<>
						<div className={style.datenext}>
							<a
								href="#"
								className={style.prevbtn}
								onClick={showPrevRecord}
							></a>
							<span>{formatDate(showDate, 8)}</span>
							<a
								href="#"
								className={style.nextbtn}
								onClick={showNextRecord}
							></a>
						</div>
						<div className={style.planrenChart}>
							{totalExpiringCount > 0 ? (
								<>
									<DoughnutChart
										labels={["Renewing", "Expiring"]}
										data={[renewingCount, totalExpiringCount - renewingCount]}
										chartType="half"
										colors={colorCodeList}
										width={width}
										height={height}
									/>
									<div className={style.halfgraph}>
										<div className={style.morerenew}>{renewingCount}</div>
										<div className={style.textdesc}>
											Out Of {totalExpiringCount} Total Plans
										</div>
									</div>
								</>
							) : (
								<div className={style.noRenewals}>
									<CustomImage
										alt="no data"
										src={addSubscriberImage}
									/>
									<h5>No renewals found for this day</h5>
								</div>
							)}
						</div>
					</>
				)}
			</div>
			<CommonModal
				show={showViewSubscriber}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleViewMoreRenewals}
				animation={false}
			>
				<PlansRenewingModal toggleViewSubscriber={toggleViewMoreRenewals} />
			</CommonModal>

			<CommonModal
				show={showRenewNotification}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleRenewNotification}
				animation={false}
			>
				<div className="setsubheader">
					<span>Notifications</span>
					<span
						className="closesetsub"
						onClick={toggleRenewNotification}
					></span>
				</div>
				<PlanRenewNotificationList />
			</CommonModal>
		</>
	);
}
