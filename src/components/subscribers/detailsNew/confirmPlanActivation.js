"use client";
import { useContext, useState } from "react";
import moment from "moment-timezone";
import style from "@/css/subscribers/subscribers.module.scss";
// import OttDetails from "@/components/plans/ottDetails";
// import { planDurations } from "@/utils/masterData";
import { formatDate, getConstant } from "@/utils/utils";
import { assignNewPlan } from "@/controllers/subscribers";
import { AppContext } from "@/contextProvider";
import { formatPrice } from "@/utils/utils";

export default function ConfirmPlanActivation({
  subscriber,
  selectedPlan,
  handleClose,
  type,
  planDate,
  toggleSuccessModal,
  planSlot,
  reloadPlan,
  reloadHistory,
  reloadBothPlan,
}) {
  const { showAlert } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  let displayDate = "Now";

  if (planDate > moment().format("YYYY-MM-DD")) {
    displayDate = formatDate(planDate, 5);
  }

  const handlePlanConfirm = async () => {
    const payload = {
      sub_id: subscriber.sub_id,
      stb_id: subscriber.stb_id,
      type: type,
      plan_code: selectedPlan.bouquet_code,
      email: subscriber.email,
      mobile: subscriber.mobile,
      start_date: planDate ?? "",
      plan_slot: planSlot ?? 1,
    };

    if (type == "add" && planDate > moment().format("YYYY-MM-DD")) {
      payload.type = "future_activate";
    }

    setIsLoading(true);
    const response = await assignNewPlan(payload);

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
        <span>Confirm Plan {type == "add" ? "Activation" : "Renewal"}</span>
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
