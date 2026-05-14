import React, { useContext, useEffect, useState } from "react";
import { formatPrice, getConstant, getPlanDuration } from "@/utils/utils";
import SelectMultiSearch from "@/common/selectMultiSearch";
import { getAllIspPlans, ispPlanReplace } from "@/controllers/isp";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";

export default function PlanReplace({ ispId, planDetail, reloadData, handleClose }) {
	const { showAlert } = useContext(AppContext);

	const [isLoading, setIsLoading] = useState(false);
	const [planId, setPlanId] = useState(null);
	const [plansList, setPlansList] = useState([]);

	useEffect(() => {
		getIspPlans();
	}, []);

	const getIspPlans = async () => {
		const payload = {
			isp_id: ispId,
		};

		const response = await getAllIspPlans(payload);
		setPlansList(response.filter((x) => x.id != planDetail.bouquet_id));
	};

	const handleReplaceClick = async () => {
		const payload = {
			isp_id: ispId,
			bouquet_id: planDetail.bouquet_id,
			replace_bouquet_id: planId,
		};

		setIsLoading(true);
		const response = await ispPlanReplace(payload);
		setIsLoading(false);

		if (response.success) {
			handleClose();
			showAlert(messages.PLAN_REPLACE_SUCCESS, 1);
			reloadData();
		} else {
			handleClose();
			showAlert(response.msg);
		}
	};

	return (
		<>
			<div className="setsubheader">
				<span>Assign A New Plan To Replace ({planDetail.bouquet_name})</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<ul className="setsubmid">
				<li id="a">
					<div className="setsubl">Plan</div>
					<div className="setsubr">{planDetail.bouquet_name}</div>
				</li>
				<div className="liWrapper">
					<li id="e">
						<div className="setsubl">Your Price</div>
						<div className="setsubr">{formatPrice(planDetail.your_price)}</div>
					</li>
					<li id="d">
						<div className="setsubl">Plan Duration</div>
						<div className="setsubr">{getPlanDuration(planDetail)}</div>
					</li>
					<li id="f">
						<div className="setsubl mt-10">Select New Plan</div>
						<div className="setsubr">
							<SelectMultiSearch
								data={plansList}
								id="planId"
								placeholder="Select Plan"
								noOptionsText="No plans found"
								callback={setPlanId}
							/>
						</div>
					</li>
				</div>
			</ul>
			<div className="setsubfooter">
				<button
					type="button"
					className="backbutton"
					onClick={handleClose}
				>
					Back
				</button>
				<button
					onClick={handleReplaceClick}
					className="savebutton"
					disabled={isLoading || planId == null}
				>
					{isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
				</button>
			</div>
		</>
	);
}
