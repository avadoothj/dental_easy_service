"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSubscriberStatus } from "@/controllers/dashboard";
import DoughnutChart from "@/components/graphs/doughnutChart";
import style from "@/css/common/common.module.scss";
import CustomImage from "@/components/common/customImage";
import { subscribersDash } from "@/utils/imagesPicker";
import Loader from "@/components/common/loader";
import ViewByOperatorModal from "./viewByOperatorModal";
import ViewByIspModal from "./viewByIspModal";
import CommonModal from "@/common/commonModal";
import { formatNumber } from "@/utils/utils";

export default function SubscriberStatus({ userType }) {
	const masterObj = {
		new: { name: "New", count: 0, color: "#6804bf", class: style.subtopp },
		inactive: { name: "Expired", count: 0, color: "#f81351", class: style.subbottom },
		suspended: { name: "Suspended", count: 0, color: "#666e91", class: style.suspended },
		scheduled: { name: "Scheduled", count: 0, color: "#ff9900", class: style.scheduled },
		active: { name: "Active", count: 0, color: "#00ba00", class: style.subnew },
		// pending: { name: "Processing", count: 0, color: "#efcf31", class: style.pending },
	};

	const [isLoading, setIsLoading] = useState(true);
	const [width, setWidth] = useState("155");
	const [height, setHeight] = useState("155");
	const [viewOperatorList, setViewOperatorList] = useState(false);
	const [viewIspList, setViewIspList] = useState(false);
	const [labelList, setLabelList] = useState([]);
	const [dataList, setDataList] = useState([]);
	const [colorList, setColorList] = useState([]);
	const [masterObject, setMasterObject] = useState(masterObj);
	const [totalCount, setTotalCount] = useState(0);
	let count = 0;
	useEffect(() => {
		if (document.body.clientWidth < 400) {
			setWidth("147");
			setHeight("147");
		}

		getSubscriberCount();
	}, []);

	const toggleViewByOperatorModal = () => {
		setViewOperatorList(!viewOperatorList);
	};

	const toggleViewByIspModal = () => {
		setViewIspList(!viewIspList);
	};

	const getSubscriberCount = async () => {
		setIsLoading(true);
		const response = await getSubscriberStatus();
		setIsLoading(false);

		if (response.success) {
			const tempData = [];
			const tempList = [];
			const tempColors = [];
			let total = 0;

			if (response.data[0].active_subscriber > 0) {
				masterObj.active.count = response.data[0].active_subscriber;
				tempList.push([masterObj.active.name]);
				tempData.push([masterObj.active.count]);
				tempColors.push([masterObj.active.color]);
				total += parseInt([masterObj.active.count]);
			}

			if (response.data[0].inactive_subscriber > 0) {
				masterObj.inactive.count = response.data[0].inactive_subscriber;
				tempList.push([masterObj.inactive.name]);
				tempData.push([masterObj.inactive.count]);
				tempColors.push([masterObj.inactive.color]);
				total += parseInt([masterObj.inactive.count]);
			}

			if (response.data[0].new > 0) {
				masterObj.new.count = response.data[0].new;
				tempList.push([masterObj.new.name]);
				tempData.push([masterObj.new.count]);
				tempColors.push([masterObj.new.color]);
				total += parseInt([masterObj.new.count]);
			}

			if (response.data[0].suspended > 0) {
				masterObj.suspended.count = response.data[0].suspended;
				tempList.push([masterObj.suspended.name]);
				tempData.push([masterObj.suspended.count]);
				tempColors.push([masterObj.suspended.color]);
				total += parseInt([masterObj.suspended.count]);
			}
			/*
			if (response.data[0].processing > 0) {
				masterObj.pending.count = response.data[0].processing;
				tempList.push([masterObj.pending.name]);
				tempData.push([masterObj.pending.count]);
				tempColors.push([masterObj.pending.color]);
				total += parseInt([masterObj.pending.count]);
			}
*/
			if (response.data[0].scheduled > 0) {
				masterObj.scheduled.count = response.data[0].scheduled;
				tempList.push([masterObj.scheduled.name]);
				tempData.push([masterObj.scheduled.count]);
				tempColors.push([masterObj.scheduled.color]);
				total += parseInt([masterObj.scheduled.count]);
			}

			setTotalCount(total);
			setMasterObject(masterObj);
			setColorList(tempColors);
			setLabelList(tempList);
			setDataList(tempData);
		}
	};

	return (
		<>
			<div className={`${style.dashcard}`}>
				<div className={style.heading}>
					<div className={style.headingleft}>
						<span>
							<CustomImage
								src={subscribersDash}
								alt="subscribersIcon"
								width="29"
								height="29"
							/>
						</span>
						Subscribers
					</div>
					{userType == "isp" ? (
						<button
							className={style.btndash}
							onClick={toggleViewByOperatorModal}
						>
							View By Operator
						</button>
					) : userType != "super isp" ? (
						<Link
							href="/subscribers/add"
							className={style.btndash}
						>
							Add New Subscriber
						</Link>
					) : (
						""
					)}
					{userType == "super isp" && (
						<button
							className={style.btndash}
							onClick={toggleViewByIspModal}
						>
							View By ISP
						</button>
					)}
				</div>

				{isLoading ? (
					<Loader />
				) : (
					<div className={style.subgraph}>
						<div className={style.subgrleft}>
							{Object.keys(masterObject).map((action, i) => {
								if (masterObject[action].count > 0) {
									count++;

									return (
										<div key={i}>
											{count > 1 && <div className={style.submiddle}></div>}
											<div className={masterObject[action].class}>
												<span className={style.col1}></span>
												<span className={style.col2}>
													{masterObject[action].count}
												</span>
												{userType === "isp" || userType === "super isp" ? (
													<button className={style.cobtn}>
														{masterObject[action].name}
													</button>
												) : (
													<Link
														href={`/subscribers?status=${masterObject[
															action
														].name.toLowerCase()}`}
														className={style.cobtn}
													>
														{masterObject[action].name}
													</Link>
												)}
											</div>
										</div>
									);
								}
							})}
						</div>
						<div className={style.subgright}>
							{!isLoading && (
								<DoughnutChart
									labels={labelList}
									data={dataList}
									colors={colorList}
									width={width}
									height={height}
								/>
							)}
							<div className={style.fullgraph}>
								<div className={style.total}>Total</div>
								<div className={style.textdesc}>{formatNumber(totalCount)}</div>
							</div>
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
					<span>Operator Status</span>
					<span
						className="closesetsub"
						onClick={toggleViewByOperatorModal}
					></span>
				</div>
				<ViewByOperatorModal toggleViewByOperatorModal={toggleViewByOperatorModal} />
			</CommonModal>

			<CommonModal
				show={viewIspList}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleViewByIspModal}
				animation={false}
			>
				<div className="setsubheader">
					<span>ISP Status</span>
					<span
						className="closesetsub"
						onClick={toggleViewByIspModal}
					></span>
				</div>
				<ViewByIspModal toggleViewByIspModal={toggleViewByIspModal} />
			</CommonModal>
		</>
	);
}
