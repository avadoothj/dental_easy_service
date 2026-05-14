"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DoughnutChart from "@/components/graphs/doughnutChart";
import { formatNumber } from "@/utils/utils";
import style from "@/css/common/common.module.scss";
import { getCouponAllocation } from "@/controllers/dashboard";
import NoRecordsFound from "./noRecordsFound";

export default function MyCouponAllocation({ userType }) {
	const masterObj = {
		assigned: {
			name: "Assigned",
			count: 0,
			color: "#00ba00",
			class: style.subnew,
			url_status: 1,
		},
		unassigned: {
			name: "Unassigned",
			count: 0,
			color: "#666e91",
			class: style.suspended,
			url_status: 0,
		},
		all: {
			name: "All",
			count: 0,
			color: "#666e91",
			class: style.suspended,
			url_status: "",
		},
	};

	const [isLoading, setIsLoading] = useState(true);
	const [width, setWidth] = useState("155");
	const [height, setHeight] = useState("155");
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

	const getSubscriberCount = async () => {
		setIsLoading(true);
		const response = await getCouponAllocation();
		setIsLoading(false);

		if (response.success) {
			setIsLoading(false);
			const tempData = [];
			const tempList = [];
			const tempColors = [];
			let total = 0;

			if (response.data[0].assigned > 0) {
				masterObj.assigned.count = response.data[0].assigned;
				tempList.push([masterObj.assigned.name]);
				tempData.push([masterObj.assigned.count]);
				tempColors.push([masterObj.assigned.color]);
				total += parseInt([masterObj.assigned.count]);
			}

			if (response.data[0].unassigned > 0) {
				masterObj.unassigned.count = response.data[0].unassigned;
				tempList.push([masterObj.unassigned.name]);
				tempData.push([masterObj.unassigned.count]);
				tempColors.push([masterObj.unassigned.color]);
				total += parseInt([masterObj.unassigned.count]);
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
			{!isLoading && totalCount > 0 ? (
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
											{userType === "isp" ? (
												<button className={style.cobtn}>
													{masterObject[action].name}
												</button>
											) : (
												<Link
													href={`/coupons?allocation=${masterObject[action].url_status}`}
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
			) : (
				<NoRecordsFound />
			)}
		</>
	);
}
