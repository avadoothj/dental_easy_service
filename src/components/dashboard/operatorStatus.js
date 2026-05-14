import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import { useEffect, useState } from "react";
import OperatorStatusModal from "./operatorStatusModal";
import Loader from "@/components/common/loader";
import { getOperatorWalletStatus } from "@/controllers/dashboard";
import { formatDate } from "@/utils/utils";
import NoRecordsFound from "./noRecordsFound";

export default function MyWalletOperatorStatus() {
	const [operatorStatusList, setOperatorStatusList] = useState([]);

	const [showOperatorModal, setShowOperatorModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState("");

	const getOperatorWalletStatusList = async () => {
		setIsLoading(true);
		const response = await getOperatorWalletStatus();
		setIsLoading(false);

		if (response.success) {
			setOperatorStatusList(response.data);
		}
	};

	useEffect(() => {
		getOperatorWalletStatusList();
	}, []);

	const toggleOperatorStatusModal = (e, date) => {
		if (e) e.preventDefault();
		setDate(date);
		setShowOperatorModal(!showOperatorModal);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{operatorStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th className={style.date}>Date</th>
									<th className={style.upcomingRene}>Upcoming Renewals</th>
									<th>Operator Wallet Status</th>
								</tr>
							</thead>
							<tbody>
								{operatorStatusList.map((item, i) => (
									<tr key={i}>
										<td>{formatDate(item.date, 9)}</td>
										<td className={style.upcomingRene}>
											{item.upcoming_renewals}
										</td>
										<td className={style.operatorsStatus}>
											<i
												className={
													item.low_balance > 0
														? style.requestBalance
														: style.sufficient
												}
											></i>

											{item.low_balance > 0 && (
												<span className={style.requestBalanceTxt}>
													({item.low_balance})
												</span>
											)}
											<a
												href="#"
												onClick={(e) =>
													toggleOperatorStatusModal(e, item.date)
												}
											>
												View
											</a>
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
			<CommonModal
				show={showOperatorModal}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleOperatorStatusModal}
				animation={false}
			>
				<div className="setsubheader">
					<span>{formatDate(date, 9)}</span>
					<span
						className="closesetsub"
						onClick={toggleOperatorStatusModal}
					></span>
				</div>

				<OperatorStatusModal date={date} />
			</CommonModal>
		</>
	);
}
