import style from "@/css/common/common.module.scss";
import CommonModal from "@/common/commonModal";
import { useEffect, useState } from "react";
import PlanRenewingStatusModal from "./planRenewingStatusModal";
import Loader from "@/components/common/loader";
import { getIspOperAutoRenewalIntentList } from "@/controllers/dashboard";
import NoRecordsFound from "./noRecordsFound";

export default function AutoRenewalStatus({ setAutoRenewCount }) {
	const [autoRenewalStatusList, setAutoRenewalStatusList] = useState([]);
	const [showAutoRenewalStatusModal, setShowAutoRenewalStatusModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const getAutoRenewalStatusList = async () => {
		setIsLoading(true);
		const response = await getIspOperAutoRenewalIntentList(true);
		setIsLoading(false);

		if (response.success) {
			setAutoRenewalStatusList(response.list);
			setAutoRenewCount(response.list.length);
		}
	};

	useEffect(() => {
		getAutoRenewalStatusList();
	}, []);

	const toggleOperatorStatusModal = () => {
		setShowAutoRenewalStatusModal(!showAutoRenewalStatusModal);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className={style.tableWrapper}>
					{autoRenewalStatusList && autoRenewalStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th>S.No.</th>
									<th>Operator Name</th>
									<th>Requests</th>
								</tr>
							</thead>
							<tbody>
								{autoRenewalStatusList.map((item, i) => (
									<tr key={i}>
										<td>{i + 1}</td>
										<td>{item.oper_name}</td>
										<td>{item.count}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<NoRecordsFound smallWidth={true} />
					)}
				</div>
			)}
			<CommonModal
				show={showAutoRenewalStatusModal}
				className="planRenewingModal"
				bodyClassName="planRenewinBody"
				handleClose={toggleOperatorStatusModal}
				animation={false}
			>
				<PlanRenewingStatusModal tabName="TabTwo" />
			</CommonModal>
		</>
	);
}
