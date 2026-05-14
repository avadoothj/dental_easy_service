import style from "@/css/subscribers/subscribers.module.scss";
import { getHistoryLog } from "@/controllers/subscribers";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/utils";

export default function CreditDebitModal({ sub_id, handleClose, planSlot }) {
	const [isLoading, setIsLoading] = useState(false);
	const [historyData, setHistoryData] = useState([]);

	const fetchHistoryData = async () => {
		setIsLoading(true);
		const response = await getHistoryLog(sub_id);
		setIsLoading(false);
		if (response.success) {
			setHistoryData(response.list);
		}
	};

	useEffect(() => {
		fetchHistoryData();
	}, []);

	return (
		<>
			<div className="setsubheader">
				<span>Auto Renewal History</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<div className={style.arHistoryModalWrap}>
				<div className={style.tableWrapper}>
					<table>
						<thead>
							<tr>
								<th>Sl No</th>
								<th>Action</th>
								<th>Action By</th>
								<th>Action Date</th>
								<th>Source</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td rowSpan={5}>Fetching records ...</td>
								</tr>
							) : historyData.length > 0 ? (
								historyData.map((x, i) => (
									<tr>
										<td>{i + 1}</td>
										<td>{x.flag == 1 ? "Enabled" : "Disabled"}</td>
										<td>{x.inserted_by}</td>
										<td>{formatDate(x.inserted_date, 2)}</td>
										<td>{x.source.toLowerCase()}</td>
									</tr>
								))
							) : (
								<tr>
									<td rowSpan={5}>No Records Found</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<div className="setsubfooter">
				<button
					className="backbutton"
					onClick={handleClose}
				>
					Back
				</button>
			</div>
		</>
	);
}
