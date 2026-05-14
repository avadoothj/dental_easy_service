import { useEffect, useState } from "react";
import style from "@/css/common/common.module.scss";
import { getMyWalletActivity } from "@/controllers/dashboard";
import { formatDate, formatPrice } from "@/utils/utils";
import Loader from "@/components/common/loader";
import NoRecordsFound from "./noRecordsFound";

export default function MyWalletActivity({ userType }) {
	const [walletActivityList, setWalletActivityList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const getWalletActivity = async () => {
		setIsLoading(true);
		const response = await getMyWalletActivity();
		setIsLoading(false);

		if (response.success) {
			setWalletActivityList(response.data);
		}
	};

	useEffect(() => {
		getWalletActivity();
	}, []);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{walletActivityList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>Status</th>
									<th>Amount</th>
									{userType == "isp" && (
										<>
											<th>Done By</th>
											<th>Remarks</th>
										</>
									)}
								</tr>
							</thead>
							<tbody>
								{walletActivityList.map((item, i) => (
									<tr key={i}>
										<td>{formatDate(item.inserted_date, 9)}</td>
										<td>{item.transaction_type}</td>
										<td
											className={
												item.transaction_type == "Credited"
													? style.credited
													: style.debited
											}
										>
											<span></span>
											{formatPrice(
												item.transaction_type == "Credited"
													? item.credit_amount
													: item.debit_amount
											)}
										</td>
										{userType == "isp" && (
											<>
												<td>{item.inserted_by}</td>
												<td>{item.reason == "NA" ? "---" : item.reason}</td>
											</>
										)}
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
