import { useEffect, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import commonStyle from "@/css/common/common.module.scss";
import ViewOperatorStatusLoading from "./loading/viewOperatorStatusLoading";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import {
	getIspOperRenewalIntentList,
	getIspOperAutoRenewalIntentList,
} from "@/controllers/dashboard";
import NoRecordsFound from "./noRecordsFound";

export default function PlanRenewingStatusModal({ tabName, handleClose }) {
	const [isLoading, setIsLoading] = useState(true);
	const [renewalIntentList, setRenewalIntentList] = useState([]);
	const [autoRenewalIntentList, setAutoRenewalIntentList] = useState([]);

	useEffect(() => {
		fetchRenewalData();
		fetchAutoData();
	}, []);

	const fetchRenewalData = async () => {
		setIsLoading(true);
		const response = await getIspOperRenewalIntentList();
		setIsLoading(false);

		if (response.success) {
			setRenewalIntentList(response.list);
		}
	};

	const fetchAutoData = async () => {
		setIsLoading(true);
		const response = await getIspOperAutoRenewalIntentList();
		setIsLoading(false);

		if (response.success) {
			setAutoRenewalIntentList(response.list);
		}
	};

	return (
		<>
			<div className="setsubheader">
				<span>All Subscriber Requests</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<Tab.Container defaultActiveKey={tabName}>
				<Nav>
					<Nav.Item>
						<Nav.Link eventKey="TabOne">Plan Renewal</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="TabTwo">Auto Renewal Setting</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Content>
					<Tab.Pane eventKey="TabOne">
						<div className={style.performanceTableWrap}>
							<table>
								<thead>
									<tr>
										<th>S.No.</th>
										<th>Operator Name</th>
										<th>Operator Code</th>
										<th>Requests</th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<ViewOperatorStatusLoading noOfColumns={4} />
									) : (
										<>
											{renewalIntentList.length > 0 ? (
												<>
													{renewalIntentList.map((item, i) => (
														<tr key={i}>
															<td>{i + 1}</td>
															<td>{item.oper_name}</td>
															<td>{item.oper_code}</td>
															<td>{item.count}</td>
														</tr>
													))}
												</>
											) : (
												<tr>
													<td colSpan="5">
														<div
															className={
																commonStyle.planRenewingTable
															}
														>
															<div className={commonStyle.dashTable}>
																<div
																	className={
																		commonStyle.tableWrapper
																	}
																>
																	<NoRecordsFound />
																</div>
															</div>
														</div>
													</td>
												</tr>
											)}
										</>
									)}
								</tbody>
							</table>
						</div>
					</Tab.Pane>

					<Tab.Pane eventKey="TabTwo">
						<div className={style.performanceTableWrap}>
							<table>
								<thead>
									<tr>
										<th>S.No.</th>
										<th>Operator Name</th>
										<th>Operator Code</th>
										<th>Requests</th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<ViewOperatorStatusLoading noOfColumns={4} />
									) : (
										<>
											{autoRenewalIntentList.length > 0 ? (
												<>
													{autoRenewalIntentList.map((item, i) => (
														<tr key={i}>
															<td>{i + 1}</td>
															<td>{item.oper_name}</td>
															<td>{item.oper_code}</td>
															<td>{item.count}</td>
														</tr>
													))}
												</>
											) : (
												<tr>
													<td colSpan="5">
														<div
															className={
																commonStyle.planRenewingTable
															}
														>
															<div className={commonStyle.dashTable}>
																<div
																	className={
																		commonStyle.tableWrapper
																	}
																>
																	<NoRecordsFound />
																</div>
															</div>
														</div>
													</td>
												</tr>
											)}
										</>
									)}
								</tbody>
							</table>
						</div>
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>
		</>
	);
}
