"use client";
import { useContext, useState } from "react";
import style from "@/css/subscribers/subscribers.module.scss";
// import OttDetails from "@/components/plans/ottDetails";
// import { planDurations } from "@/utils/masterData";
import { formatDate, getConstant } from "@/utils/utils";
import { upgradePlan } from "@/controllers/subscribers";
import { AppContext } from "@/contextProvider";
import { formatPrice } from "@/utils/utils";
import { getDateDifference, currentDateTime } from "@/utils/dateHelper";
import SimpleTooltip from "@/components/common/simpleTooltip";
import CustomImage from "@/components/common/customImage";
import { iInfoIcon } from "@/utils/imagesPicker";

export default function ConfirmPlanUpgrade({
  subscriber,
  selectedPlan,
  handleClose,
  toggleSuccessModal,
  currentPlan,
  planSlot,
  reloadBothPlan,
  reloadHistory,
}) {
  const { showAlert } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const CurrentDate = currentDateTime();
  let displayDate = "Now";

  const handlePlanConfirm = async () => {
    const payload = {
      oper_id: subscriber.oper_id,
      oper_code: subscriber.oper_code,
      sub_id: subscriber.sub_id,
      bouquet_id: selectedPlan.bouquet_id,
      email: subscriber.email,
      mobile: subscriber.mobile,
      plan_slot: planSlot ?? 1,
    };

    setIsLoading(true);
    const response = await upgradePlan(payload);

    if (response.success) {
      handleClose();
      toggleSuccessModal();
      reloadBothPlan();
      reloadHistory();
    } else {
      setIsLoading(false);
      showAlert(response.msg);
    }
  };

  return (
    <>
      <div className="setsubheader">
        <span>Confirm Plan Upgrade</span>
        <span className="closesetsub" onClick={handleClose}></span>
      </div>
      <div className={style.confirmPlanModalWrap}>
        <div className={style.confirmplancol}>
          <div className={style.prevrowcol}>
            <p className={style.collef}>Subscriber</p>
            <p className={style.colref}>
              <span>
                {subscriber.first_name} {subscriber.last_name}
              </span>
            </p>
          </div>
          <div className={style.prevrowcol}>
            <p className={style.collef}>
              {subscriber.smart_card_no.includes("@")
                ? "Email"
                : "Mobile Number"}
            </p>
            <p className={style.colref}>
              <span>{subscriber.smart_card_no}</span>
            </p>
          </div>
          <div className={style.prevrowcol}>
            <p className={style.collef}>Start</p>
            <p className={style.colref}>
              <span className={style.now}>{displayDate}</span>
            </p>
          </div>
        </div>
        <div className={style.packbox}>
          <h2>{selectedPlan.bouquet_name}</h2>
          <div className={style.planname}>
            {/* {planDurations[selectedPlan.bouquet_period]} */}
          </div>
          {/* <OttDetails ottList={selectedPlan.channels} showAll={true} /> */}
          <div className={style.priceWrapper}>
            <div className={style.yourPrice}>
              Your Price<span>{formatPrice(selectedPlan.lco_price)}</span>
            </div>
            <div className={style.subsCriberPrice}>
              <div className={style.text}>
                Subscriber Price
                <span>{formatPrice(selectedPlan.subscriber_price)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.packbox}>
          <h2>
            Refund
            <SimpleTooltip
              text={
                <>
                  Current Pack Activation Date &nbsp;-&nbsp;
                  {formatDate(currentPlan.start_date)}
                  <br />
                  Duration &nbsp;-&nbsp;
                  {`${currentPlan.current_plan_days_expected}`} days
                  <br />
                  Days Consumed &nbsp;-&nbsp;
                  {currentPlan.current_plan_days_used} days
                </>
              }
            >
              <div className={style.tnamelft}>
                <span>{""}</span>
                &nbsp;
                <span className={style.infoicn}>
                  <CustomImage
                    src={iInfoIcon}
                    alt="info"
                    width="16"
                    height="16"
                  />
                </span>
              </div>
            </SimpleTooltip>
          </h2>
          <div className={style.pendingValidity}>
            Current Pack Pending Validity&nbsp;
            <span>
              {currentPlan.current_plan_days_expected -
                currentPlan.current_plan_days_used}
              &nbsp; days
            </span>
          </div>
          <div className={style.priceWrapper}>
            <div className={style.yourPrice}>
              Refund Amount&nbsp;
              <span>
                {formatPrice(currentPlan.current_plan_unused_oper_price)}
              </span>
            </div>
          </div>
        </div>
        <div className={style.packbox}>
          <h2>Total</h2>
          <div className={style.pendingValidity}>
            Your Price for New Pack&nbsp;
            <span>{formatPrice(selectedPlan.lco_price)}</span>
          </div>
          <div className={style.priceWrapper}>
            <div className={style.yourPrice}>
              Refund Amount&nbsp;
              <span>
                {formatPrice(currentPlan.current_plan_unused_oper_price)}
              </span>
            </div>
            <div className={style.subsCriberPrice}>
              <div className={style.text}>
                Net Payable&nbsp;
                <span>
                  {formatPrice(
                    selectedPlan.lco_price -
                      currentPlan.current_plan_unused_oper_price >
                      0
                      ? selectedPlan.lco_price -
                          currentPlan.current_plan_unused_oper_price
                      : 0,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
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
          onClick={handlePlanConfirm}
          disabled={isLoading}
        >
          {isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
        </button>
      </div>
    </>
  );
}
