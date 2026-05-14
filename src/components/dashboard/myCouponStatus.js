"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DoughnutChart from "@/components/graphs/doughnutChart";
import { formatNumber } from "@/utils/utils";
import style from "@/css/common/common.module.scss";
import NoRecordsFound from "./noRecordsFound";

export default function MyCouponStatus({ userType, response }) {
	const masterObj = {
		active: { name: "Active", count: 0, color: "#00ba00", class: style.subnew, url_status: 0 },
		redeemed: {
			name: "Redeemed",
			count: 0,
			color: "#666e91",
			class: style.suspended,
			url_status: 1,
		},
		expired: {
			name: "Expired",
			count: 0,
			color: "#f81351",
			class: style.subbottom,
			url_status: 2,
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
		if (response.success) {
			setIsLoading(false);
			const tempData = [];
			const tempList = [];
			const tempColors = [];
			let total = 0;

			if (response.data[0].active > 0) {
				masterObj.active.count = response.data[0].active;
				tempList.push([masterObj.active.name]);
				tempData.push([masterObj.active.count]);
				tempColors.push([masterObj.active.color]);
				total += parseInt([masterObj.active.count]);
			}

			if (response.data[0].redeemed > 0) {
				masterObj.redeemed.count = response.data[0].redeemed;
				tempList.push([masterObj.redeemed.name]);
				tempData.push([masterObj.redeemed.count]);
				tempColors.push([masterObj.redeemed.color]);
				total += parseInt([masterObj.redeemed.count]);
			}

			if (response.data[0].expired > 0) {
				masterObj.expired.count = response.data[0].expired;
				tempList.push([masterObj.expired.name]);
				tempData.push([masterObj.expired.count]);
				tempColors.push([masterObj.expired.color]);
				total += parseInt([masterObj.expired.count]);
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
													href={`/coupons?status=${masterObject[action].url_status}`}
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
