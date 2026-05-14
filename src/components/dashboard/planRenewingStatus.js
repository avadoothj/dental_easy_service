import style from "@/css/common/common.module.scss";
import { getIspOperRenewalIntentList } from "@/controllers/dashboard";
import { useEffect, useState } from "react";
import PlanRenewingStatusModal from "./planRenewingStatusModal";
import Loader from "@/components/common/loader";
import NoRecordsFound from "./noRecordsFound";
import CommonModal from "@/common/commonModal";

export default function PlanRenewingStatus({ setRenewingCount }) {
	const [planRenewingStatusList, setPlanRenewingStatusList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAutoRenewalStatusModal, setShowAutoRenewalStatusModal] = useState(false);

	const getPlanRenewingStatus = async () => {
		setIsLoading(true);
		const response = await getIspOperRenewalIntentList(true);
		setIsLoading(false);

		if (response.success) {
			setPlanRenewingStatusList(response.list);
			setRenewingCount(response.list.length);
		}
	};

	useEffect(() => {
		getPlanRenewingStatus();
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
					{planRenewingStatusList && planRenewingStatusList.length > 0 ? (
						<table>
							<thead>
								<tr>
									<th>S.No.</th>
									<th>Operator Name</th>
									<th>Requests</th>
								</tr>
							</thead>

							<tbody>
								{planRenewingStatusList.map((item, i) => (
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
				<PlanRenewingStatusModal tabName="TabOne" />
			</CommonModal>
		</>
	);
}
