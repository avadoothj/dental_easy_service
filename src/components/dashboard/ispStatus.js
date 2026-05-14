import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import { useEffect, useState } from "react";
import OperatorStatusModal from "./operatorStatusModal";
import Loader from "@/components/common/loader";
import { getIspWalletStatus } from "@/controllers/dashboard";
import { formatDate } from "@/utils/utils";
import NoRecordsFound from "./noRecordsFound";

export default function MyWalletIspStatus() {
	const [ispStatusList, setIspStatusList] = useState([]);

	const [showIspModal, setShowIspModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState("");

	const getIspWalletStatusList = async () => {
		setIsLoading(true);
		const response = await getIspWalletStatus();
		setIsLoading(false);

		if (response.success) {
			setIspStatusList(response.data);
		}
	};

	useEffect(() => {
		getIspWalletStatusList();
	}, []);

	const toggleIspStatusModal = (e, date) => {
		if (e) e.preventDefault();
		setDate(date);
		setShowIspModal(!showIspModal);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{ispStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th className={style.date}>Date</th>
									<th className={style.upcomingRene}>Upcoming Renewals</th>
									<th>ISP Wallet Status</th>
								</tr>
							</thead>
							<tbody>
								{ispStatusList.map((item, i) => (
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
													toggleIspStatusModal(e, item.date)
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
				show={showIspModal}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleIspStatusModal}
				animation={false}
			>
				<div className="setsubheader">
					<span>{formatDate(date, 9)}</span>
					<span
						className="closesetsub"
						onClick={toggleIspStatusModal}
					></span>
				</div>

				<OperatorStatusModal date={date} isIsp={true} />
			</CommonModal>
		</>
	);
}
