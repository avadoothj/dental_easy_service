import style from "@/css/common/common.module.scss";
import { getMyWallet } from "@/controllers/dashboard";
import { useEffect, useState } from "react";
import { formatDate, formatPrice } from "@/utils/utils";
import Loader from "@/components/common/loader";
import NoRecordsFound from "./noRecordsFound";

export default function MyWalletStatus() {
	const [walletStatusList, setWalletStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getWalletStatus = async () => {
		setIsLoading(true);
		const response = await getMyWallet();
		setIsLoading(false);

		if (response.success) {
			setWalletStatusList(response.data);
		}
	};

	useEffect(() => {
		getWalletStatus();
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{walletStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th className={style.upcomingRene}>Upcoming Renewals</th>
									<th className={style.balRequired}>Balance Required</th>
								</tr>
							</thead>

							<tbody>
								{walletStatusList.map((item, i) => (
									<tr key={i}>
										<td>{formatDate(item.end_date, 9)}</td>
										<td className={style.upcomingRene}>
											{item.upcoming_renewals}
										</td>
										<td className={style.balRequired}>
											<i
												className={
													item.is_sufficient
														? style.sufficient
														: style.requestBalance
												}
											></i>
											{formatPrice(item.amount_required)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<NoRecordsFound />
					)}
				</div>
			)}
		</>
	);
}
