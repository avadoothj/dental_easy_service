import React, { useContext, useEffect, useState } from "react";
import { formatPrice, getConstant, getPlanDuration } from "@/utils/utils";
import style from "@/css/plan/plancard.module.scss";
import OttDetails from "@/components/plans/ottDetails";
import SimpleTooltip from "@/common/simpleTooltip";
import { unassignOperatorPlan } from "@/controllers/operators";
import ConfirmationPopup from "@/components/layout/confirmationPopup";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import CommonModal from "@/components/common/commonModal";
import PlanReplace from "@/components/isp/planReplace";
import { ispPlanInactivate } from "@/controllers/isp";

export default function PlanCard({
	item,
	handlePlanSelect,
	showUnassignPlanBtn = false,
	reloadData,
	operator,
}) {
	const { showAlert, user } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showReplaceModal, setShowReplaceModal] = useState(false);
	const [showInactiveConfirmation, setShowInactiveConfirmation] = useState(false);

	const toggleConfirmation = () => {
		setShowConfirmation(!showConfirmation);
	};

	const toggleInactiveConfirmation = () => {
		setShowInactiveConfirmation(!showInactiveConfirmation);
	};

	const toggleReplaceModal = () => {
		setShowReplaceModal(!showReplaceModal);
	};

	const unassignSelectedPlan = async () => {
		const payload = {
			oper_id: operator.oper_id,
			bouquet_id: item.bouquet_id,
		};

		setIsLoading(true);
		const response = await unassignOperatorPlan(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.OPERATOR_PLAN_REMOVE_SUCCESS, 1);
			reloadData();
			if (jQuery("#plan_tab").length > 0) {
				jQuery("#plan_tab")
					.find("span")
					.text(
						"- " +
							parseInt(
								parseInt(
									jQuery("#plan_tab").find("span").text().replace("-", "").trim()
								) - 1
							)
					);
			}
		} else {
			showAlert(response.msg);
		}
	};

	const handleInactiveClick = async () => {
		const payload = {
			isp_id: operator.oper_id,
			bouquet_id: item.bouquet_id,
		};

		setIsLoading(true);
		const response = await ispPlanInactivate(payload);
		setIsLoading(false);

		if (response.success) {
			toggleInactiveConfirmation();
			showAlert(messages.PLAN_INACTIVE_SUCCESS, 1);
			reloadData();
		} else {
			toggleInactiveConfirmation();
			showAlert(response.msg);
		}
	};

	const renderCard = () => (
		<div
			className={`${style.planCard} ${item.plan_status == 0 ? style.disabled : ""}`}
			onClick={() => {
				if (item.plan_status == 0) return false;
				handlePlanSelect(item);
			}}
		>
			<h2>{item.bouquet_name}</h2>
			<p>
				Plan Code:<span>{item.bouquet_code}</span>
			</p>
			<hr className={style.line1} />
			<h3>{getPlanDuration(item)}</h3>
			<OttDetails ottList={item.channels} />

			<hr className={style.line2} />
			<div className={style.priceWrapper}>
				<div className={style.yourPrice}>
					Your Price<span>{formatPrice(item.your_price)}</span>
				</div>
				{item.subscriber_price != null && (
					<div className={style.subsCriberPrice}>
						<div className={style.text}>
							Subscriber Price&nbsp;
							<span>{formatPrice(item.subscriber_price)}</span>
						</div>
					</div>
				)}
			</div>

			{user.user_type != "regional head" && item.plan_status == 1 ? (
				<>
					{user?.allowedLinks.indexOf("/planInactivationReassignment") == -1 ? (
						<>
							{showUnassignPlanBtn != 0 && (
								<div className={style.planUnassignWrapper}>
									{item.is_plan_assigned == 1 ? (
										<SimpleTooltip
											text={messages.SUBSCRIPTION_EXISTS_ACTION_NOT_ALLOWED}
										>
											<button disabled>Unassign Plan</button>
										</SimpleTooltip>
									) : (
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleConfirmation();
											}}
											disabled={isLoading}
										>
											{isLoading
												? getConstant("LOADING_TEXT")
												: "Unassign Plan"}
										</button>
									)}
								</div>
							)}
						</>
					) : (
						<>
							<hr className={style.line2} />
							<div className={style.planUnassignWrapperNew}>
								{showUnassignPlanBtn != 0 ? (
									<>
										{item.is_plan_assigned == 1 ? (
											<SimpleTooltip
												text={
													messages.SUBSCRIPTION_EXISTS_ACTION_NOT_ALLOWED
												}
											>
												<div
													className={`${style.ternaryBtn} ${style.btnDisabled}`}
												>
													Unassign Plan
												</div>
											</SimpleTooltip>
										) : (
											<a
												href="#"
												className={style.ternaryBtn}
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													toggleConfirmation();
												}}
											>
												{isLoading
													? getConstant("LOADING_TEXT")
													: "Unassign Plan"}
											</a>
										)}
									</>
								) : (
									<SimpleTooltip
										text={messages.SUBSCRIPTION_EXISTS_ACTION_NOT_ALLOWED}
									>
										<div className={`${style.ternaryBtn} ${style.btnDisabled}`}>
											Unassign Plan
										</div>
									</SimpleTooltip>
								)}

								{user?.allowedLinks.indexOf("/planInactivationReassignment") >=
									0 && (
									<div className={style.priceWrapper}>
										<div
											className={style.changeOptPrice}
											onClick={(e) => {
												e.stopPropagation();
												toggleInactiveConfirmation();
											}}
										>
											Inactive Plan
										</div>
										<div
											className={style.setsubPrice}
											onClick={(e) => {
												e.stopPropagation();
												toggleReplaceModal();
											}}
										>
											Replace Plan
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</>
			) : (
				<>
					{item.replace_bouquet_id != null && (
						<>
							<hr className={style.line2} />
							<div className={style.replaceDiv}>
								<strong>
									Replaced with -&nbsp;
									<span className="statusRed">{item.replace_bouquet_name}</span>
								</strong>
								<span>
									Plan Code:&nbsp;
									<span className="statusRed">{item.replace_bouquet_code}</span>
								</span>
							</div>
						</>
					)}
				</>
			)}
		</div>
	);

	return (
		<>
			{item.plan_status == 0 ? (
				<SimpleTooltip text={messages.PLAN_NO_LONGER_EXISTS}>{renderCard()}</SimpleTooltip>
			) : (
				renderCard()
			)}

			<ConfirmationPopup
				show={showConfirmation}
				message={`You want to unassign plan for this operator?`}
				isLoading={isLoading}
				handleClose={toggleConfirmation}
				confirmAction={unassignSelectedPlan}
			/>

			<ConfirmationPopup
				show={showInactiveConfirmation}
				heading={`Inactive Plan?`}
				message={`Are you sure you want to mark this plan as inactive`}
				info={`Future activations will be cancelled. Active subscriptions will continue till expiry.`}
				isLoading={isLoading}
				handleClose={toggleInactiveConfirmation}
				confirmAction={handleInactiveClick}
			/>

			<CommonModal
				show={showReplaceModal}
				className="setpricemodel"
				bodyClassName="setpricepad"
				handleClose={toggleReplaceModal}
				animation={false}
			>
				<PlanReplace
					ispId={operator.oper_id}
					planDetail={item}
					handleClose={toggleReplaceModal}
					reloadData={reloadData}
				/>
			</CommonModal>
		</>
	);
}
