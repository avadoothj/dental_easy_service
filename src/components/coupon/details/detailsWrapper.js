"use client";
import { useEffect } from "react";
import style from "@/css/coupon/coupon.module.scss";
import { formatDate, formatPrice } from "@/utils/utils";
import { couponListStatus } from "@/utils/masterData";

export default function DetailsWrapper({ couponListDetail }) {
	const statusClass = couponListStatus[couponListDetail.status].toLowerCase();

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	return (
		<div className={style.couponDetail}>
			<h2>Details</h2>
			<div className={style.detailGrid}>
				<div className={style.detailCol}>
					<label>Coupon Serial No</label>
					<div className={style.inputDetail}>{couponListDetail.coupon_serial_no}</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Request ID</label>
					<div className={style.inputDetail}>{couponListDetail.cms_request_id}</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Plan Name</label>
					<div className={style.inputDetail}>{couponListDetail.bouquet_name}</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Expiry Date</label>
					<div className={style.inputDetail}>
						{formatDate(couponListDetail.expiry_date)}
					</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Discount</label>
					<div className={style.inputDetail}>
						{couponListDetail.discount_type == "flat"
							? formatPrice(couponListDetail.discount)
							: couponListDetail.discount + " %"}
					</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Retailer</label>
					<div className={style.inputDetail}>
						{couponListDetail.oper_name ? couponListDetail.oper_name : "---"}
					</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Created Date</label>
					<div className={style.inputDetail}>
						{formatDate(couponListDetail.inserted_date, 2)}
					</div>
				</div>
				<hr />
				<div className={style.detailCol}>
					<label>Status</label>
					<div className={style.inputDetail}>
						<span className={style[statusClass]}>
							{couponListStatus[couponListDetail.status]}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
