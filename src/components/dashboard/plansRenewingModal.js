import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { getPlanRenewalsList } from "@/controllers/dashboard";
import style from "@/css/common/dashboard.module.scss";
import { currentDate } from "@/utils/dateHelper";
import { arrayUnique, formatDate, getConstant } from "@/utils/utils";
import PlanExpiringCard from "./planExpiringCard";
import ExpiringCardLoading from "./loading/expiringCard";

export default function PlansRenewingModal({ toggleViewSubscriber }) {
	const noOfDays = getConstant("PLAN_RENEWING_DAYS");

	const [isLoading, setIsLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [originalData, setOriginalData] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const [showDate, setShowDate] = useState(currentDate());
	const [daysList, setDaysList] = useState([]);

	useEffect(() => {
		plansExpiringList();
	}, []);

	const plansExpiringList = async () => {
		setIsLoading(true);
		const response = await getPlanRenewalsList(noOfDays);
		setIsLoading(false);

		if (response.success) {
			if (response.list.length > 0) {
				setDaysList(arrayUnique(response.list.map((x) => x.end_date)));

				setShowDate(response.list[0]["end_date"]);
				setOriginalData(response.list);
				setDisplayData(
					response.list.filter((x) => x.end_date == response.list[0]["end_date"])
				);
			}
		}
	};

	const showPrevRecord = (e) => {
		e.preventDefault();

		if (currentIndex > 0) {
			const newIndex = currentIndex - 1;
			const newDate = formatDate(moment(daysList[newIndex]), 3);

			setShowDate(newDate);
			setCurrentIndex(newIndex);
			setDisplayData(originalData.filter((x) => x.end_date == newDate));
		}
	};

	const showNextRecord = (e) => {
		e.preventDefault();

		if (currentIndex < daysList.length - 1) {
			const newIndex = currentIndex + 1;
			const newDate = formatDate(moment(daysList[newIndex]), 3);

			setShowDate(newDate);
			setCurrentIndex(newIndex);
			setDisplayData(originalData.filter((x) => x.end_date == newDate));
		}
	};

	return (
		<>
			<div className="setsubheader">
				<span>Plans Not Renewing For</span>
				<span
					className="closesetsub"
					onClick={toggleViewSubscriber}
				></span>
			</div>
			<div className={style.datenext}>
				{!isLoading && (
					<>
						{daysList.length > 1 ? (
							<a
								href="#"
								className={style.prevbtn}
								onClick={showPrevRecord}
							></a>
						) : (
							<span></span>
						)}
						<span>{formatDate(showDate, 8)}</span>
						{daysList.length > 1 ? (
							<a
								href="#"
								className={style.nextbtn}
								onClick={showNextRecord}
							></a>
						) : (
							<span></span>
						)}
					</>
				)}
			</div>
			<div className={style.planRenewingList}>
				{isLoading ? (
					<ExpiringCardLoading />
				) : (
					<ul>
						{displayData.map((item, i) => (
							<PlanExpiringCard
								key={i}
								item={item}
							/>
						))}
					</ul>
				)}
			</div>
		</>
	);
}
