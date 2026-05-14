"use client";
import style from "@/css/common/header.module.scss";
import style2 from "@/css/common/sidebar.module.scss";

export default function AutoRenewSection({ header = true, autoRenewal }) {
	return (
		<>
			{autoRenewal.success && autoRenewal.flag >= 0 && (
				<>
					{header ? (
						<li className={style.wallet}>
							<a href="#">
								Auto Renewal: <span>{autoRenewal.flag == 1 ? "On" : "Off"}</span>
							</a>
						</li>
					) : (
						<li className={`${style2.wallet} ${style2.autoRenewal}`}>
							<a href="#">
								<h5>Auto Renewal</h5>
								<span>{autoRenewal.flag == 1 ? "On" : "Off"}</span>
							</a>
						</li>
					)}
				</>
			)}
		</>
	);
}
