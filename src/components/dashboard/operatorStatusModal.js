import Link from "next/link";
import { useEffect, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import { getOperatorBalanceList } from "@/controllers/dashboard";
import { formatPrice } from "@/utils/utils";
import ViewOperatorStatusLoading from "./loading/viewOperatorStatusLoading";

export default function OperatorStatusModal({ date, isIsp = false }) {
	const [isLoading, setIsLoading] = useState(true);
	const [operatorBalanceList, setOperatorBalanceList] = useState([]);
	const getOperatorList = async () => {
		const response = await getOperatorBalanceList(date);
		setIsLoading(false);
		if (response.success) {
			setOperatorBalanceList(response.data);
		}
	};

	useEffect(() => {
		getOperatorList();
	}, []);

	return (
		<>
			<div className={style.performanceTableWrap}>
				<table>
					<thead>
						<tr>
							<th className={style.planName}>
								{isIsp == true ? "ISP Name" : "Operator Name"}
							</th>
							<th className={style.center}>Upcoming Renewals</th>
							<th className={style.center}>Required Balance</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<ViewOperatorStatusLoading />
						) : (
							<>
								{operatorBalanceList.map((item, i) => (
									<tr key={i}>
										<td>{isIsp == true ? item.isp_name : item.oper_name}</td>
										<td className={style.center}>{item.upcoming_renewals}</td>
										<td className={style.center}>
											<div className={style.balRequired}>
												<i
													className={
														item.is_sufficient
															? style.sufficient
															: style.requestBalance
													}
												></i>
												{formatPrice(item.amount_required)}
												{!item.is_sufficient && (
													<Link
														href={
															"/operatorWallet/details/" +
															(isIsp == true
																? item.dist_id
																: item.oper_id)
														}
														target="_blank"
													>
														Add Balance
													</Link>
												)}
											</div>
										</td>
									</tr>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
