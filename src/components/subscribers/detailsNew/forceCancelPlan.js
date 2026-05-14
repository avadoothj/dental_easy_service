"use client";
import { useContext, useState } from "react";
import moment from "moment-timezone";
import style from "@/css/subscribers/subscribers.module.scss";
import { getConstant, formatPrice } from "@/utils/utils";
import { AppContext } from "@/contextProvider";
import { forcePlanCancel } from "@/controllers/subscribers";

export default function ForceCancelPlan({
	subscriber,
	handleClose,
	isForceCancel,
	planSlot,
	reloadHistory,
	reloadBothPlan,
}) {
	const { showAlert, user } = useContext(AppContext);

	const [isLoading, setIsLoading] = useState(false);
	const [cancelCurrentPlan, setCancelCurrentPlan] = useState(
		subscriber.planDetails.length > 1 ? false : true
	);

	const handlePlanCancel = async () => {
		const payload = {
			sub_id: subscriber.sub_id,
			type: cancelCurrentPlan ? "full" : "partial",
			plan_slot: planSlot ?? 1,
		};

		if (user?.role_id == getConstant("SUPER_ADMIN_ROLE_ID") && isForceCancel) {
			payload.force_cancel = 1;
		}

		setIsLoading(true);
		const response = await forcePlanCancel(payload);

		if (response.success) {
			showAlert(response.msg, 1);
			handleClose();
			setTimeout(() => {
				jQuery("#resetPlanPageBtn").trigger("click");
			}, 200);
			reloadBothPlan();
			reloadHistory();
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	const toggleCurrentPlanClick = () => {
		setCancelCurrentPlan(!cancelCurrentPlan);
	};

	return (
		<>
			<div className="setsubheader">
				<span>{isForceCancel ? "Force " : ""}Cancel Plan</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<div className={style.cancelPlanModalWrap}>
				<h4 className={style.MainHeading}>
					Are you sure you want to {isForceCancel ? "force " : ""}cancel&nbsp;
					{cancelCurrentPlan ? "all the" : "advanced renewal"}
					&nbsp;plans for this subscriber?
				</h4>
				{subscriber.planDetails.map((plan, idx) => (
					<div
						key={idx}
						className={style.inner}
					>
						{idx === 0 && (
							<>
								<h4 className={style.innerHeading}>
									Current Plan
									{subscriber.planDetails.length > 1 && (
										<div className={style.checkboxWrap}>
											<label className={style.checkboxlabel}>
												<input
													type="checkbox"
													name="cancel_plan"
													checked={cancelCurrentPlan}
													onChange={toggleCurrentPlanClick}
												/>
												<span className={style.checkmark}></span>
											</label>
										</div>
									)}
								</h4>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Plan</p>
									<p className={style.colref}>
										<span>{plan.bouquet_name}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Activation</p>
									<p className={style.colref}>
										<span>{moment(plan.start_date).format("DD-MM-YYYY")}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Valid Upto</p>
									<p className={style.colref}>
										<span>{moment(plan.end_date).format("DD-MM-YYYY")}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Refund Amount</p>
									<p className={style.colref}>
										<span className={style.amountRed}>
											{moment(moment().format("YYYY-MM-DD")).isSameOrAfter(
												moment(plan.start_date).format("YYYY-MM-DD")
											)
												? "₹ 0"
												: formatPrice(plan.lco_price)}
										</span>
									</p>
								</div>
							</>
						)}
						{idx === 1 && (
							<>
								<h4 className={style.innerHeading}>
									Advanced Renewal Plan
									<div className={style.checkboxWrap}>
										<label className={style.checkboxlabel}>
											<input
												type="checkbox"
												name="cancel_plan"
												checked={true}
												disabled
											/>
											<span className={style.checkmark}></span>
										</label>
									</div>
								</h4>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Plan</p>
									<p className={style.colref}>
										<span>{plan.bouquet_name}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Activation</p>
									<p className={style.colref}>
										<span>{moment(plan.start_date).format("DD-MM-YYYY")}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Valid Upto</p>
									<p className={style.colref}>
										<span>{moment(plan.end_date).format("DD-MM-YYYY")}</span>
									</p>
								</div>
								<div className={style.prevrowcol}>
									<p className={style.collef}>Refund Amount</p>
									<p className={style.colref}>
										<span className={style.amountGreen}>
											{moment(moment().format("YYYY-MM-DD")).isSameOrAfter(
												moment(plan.start_date).format("YYYY-MM-DD")
											)
												? "₹ 0"
												: formatPrice(plan.lco_price)}
										</span>
									</p>
								</div>
							</>
						)}
					</div>
				))}

				<p className={style.note}>
					{subscriber.planDetails.length > 1
						? cancelCurrentPlan
							? "Cancelling plan will lead to cancellation of both current & advanced renewal plans."
							: "Cancelling plan will lead to cancellation of advanced renewal plan."
						: "Cancelling plan will lead to cancellation of current plan."}
					{/* Cancelling plan will lead to cancellation of both current &#38; advanced renewal plans, if any. */}
				</p>
			</div>
			<div className="setsubfooter">
				<button
					className="backbutton"
					onClick={handleClose}
					disabled={isLoading}
				>
					Back
				</button>
				<button
					className="savebutton"
					onClick={handlePlanCancel}
					disabled={isLoading}
				>
					{isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
				</button>
			</div>
		</>
	);
}
