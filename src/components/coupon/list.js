"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCouponList } from "@/controllers/coupon";
import CustomDataTable from "@/common/customDatatable";
import { couponListStatus, couponStatusList } from "@/utils/masterData";
import { formatDate, formatPrice } from "@/utils/utils";

export default function CouponList({ planList, userType }) {
	const columnList = [
		"SL NO",
		"Coupon Serial Number",
		"Plan Name",
		"Discount",
		"Status",
		"Retailer",
		"Expiry Date",
	];

	const couponClassList = {
		0: "statusGreen",
		1: "statusViolet",
		2: "statusRed",
	};

	let extraFilters = [
		{
			label: "Status",
			filter: "status",
			data: couponStatusList,
		},
	];

	if (planList !== null) {
		extraFilters = [
			{
				label: "Plan",
				filter: "plan_id",
				data: [{ id: "", label: "All" }, ...planList],
			},
			{
				label: "Allocation",
				filter: "allocation",
				data: [
					{ id: "", label: "All" },
					{ id: "1", label: "Assigned" },
					{ id: "0", label: "Unassigned" },
				],
			},
			...extraFilters,
		];
	}

	const getStatusClass = (status) => {
		return couponClassList[status] ?? "";
	};

	const childRef = useRef();

	const [list, setList] = useState([]);
	const [srNo, setSrNo] = useState(1);

	useEffect(() => {
		if (childRef.current) {
			childRef.current.reloadData();
		}
	}, []);

	return (
		<>
			<CustomDataTable
				apiCall={getCouponList}
				setData={setList}
				setSrNo={setSrNo}
				columns={columnList}
				placeholderText="Search Plans / Coupon"
				ref={childRef}
				btnLink={
					userType != "retailer"
						? { label: "Assign Coupon", link: "/coupons/assign", hidePlus: true }
						: null
				}
				extraFilters={extraFilters}
			>
				{list.map((x, i) => (
					<tr key={i}>
						<td>{srNo + i}</td>
						<td>
							<Link href={"/coupons/details/" + x.id}>{x.coupon_serial_no}</Link>
						</td>
						<td>{x.bouquet_name}</td>
						<td>
							{x.discount_type == "flat"
								? formatPrice(x.discount)
								: x.discount + " %"}
						</td>
						<td>
							<div className={getStatusClass(x.status)}>
								{couponListStatus[x.status] || "-"}
							</div>
						</td>
						<td>{x.retailer_name ? x.retailer_name : "---"}</td>
						<td>{formatDate(x.expiry_date)}</td>
					</tr>
				))}
			</CustomDataTable>
		</>
	);
}
