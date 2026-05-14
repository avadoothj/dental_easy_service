import { useContext, useState } from "react";
import style from "@/css/plan/plancard.module.scss";
import OttDetails from "@/components/plans/ottDetails";
import { formatPrice, getPlanDuration, getConstant } from "@/utils/utils";
import ConfirmationPopup from "@/components/layout/confirmationPopup";
import { ispPlanInactivate, unassignIspPlan } from "@/controllers/isp";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import SimpleTooltip from "@/common/simpleTooltip";
import PlanReplace from "./planReplace";
import CommonModal from "@/common/commonModal";

export default function PlanCard({ item, showUnassignPlanBtn = false, ispId, isp, reloadData }) {
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
			oper_id: ispId,
			bouquet_id: item.bouquet_id,
		};

		setIsLoading(true);
		const response = await unassignIspPlan(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.ISP_PLAN_REMOVE_SUCCESS, 1);
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
			isp_id: ispId,
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
		<div className={`${style.planCard} ${item.plan_status == 0 ? style.disabled : ""}`}>
			<h2>{item.bouquet_name}</h2>
			<p>
				Plan Code:<span>{item.bouquet_code}</span>
			</p>
			<hr className={style.line1} />
			<h3>{getPlanDuration(item)}</h3>
			<OttDetails
				ottList={item.channels}
				showAll={true}
			/>
			<hr className={style.line2} />
			<div className={style.priceWrapper}>
				<div className={style.yourPrice}>
					Your Price<span>{formatPrice(item.your_price)}</span>
				</div>
				{item.isp_price && (
					<div className={style.yourPrice}>
						ISP Price<span>{formatPrice(item.isp_price)}</span>
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
											onClick={toggleInactiveConfirmation}
										>
											Inactive Plan
										</div>
										<div
											className={style.setsubPrice}
											onClick={toggleReplaceModal}
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
				message={`You want to unassign plan for this ISP?`}
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
					ispId={ispId}
					planDetail={item}
					handleClose={toggleReplaceModal}
					reloadData={reloadData}
				/>
			</CommonModal>
		</>
	);
}
