import { useEffect } from "react";
import style from "@/css/subscribers/subscribers.module.scss";
// import OttDetails from "@/components/plans/ottDetails";
import CustomDatepicker from "@/common/customDatepicker";
import {
  formatDate,
  formatPrice,
  getConstant,
  getPlanDuration,
} from "@/utils/utils";
import { addNoOfDays, currentDate } from "@/utils/dateHelper";

export default function PlanSelect({
  prevStep,
  type,
  selectedPlan,
  handlePlanConfirm,
  autoRenewIsLoading,
  planDate,
  setPlanDate,
}) {
  const todaysDate = currentDate();

  useEffect(() => {
    if (type == "add") {
      setPlanDate(todaysDate);
    }
  }, []);

  return (
    <div className={style.subsPlanTable}>
      <div className={style.plantableSec}>
        <div className={`${style.planRow1} ${style.mBorder}`}>
          <div className={style.col}>Plan</div>
          <div className={style.col}>
            <b>{selectedPlan.bouquet_name}</b>
          </div>
        </div>
        <div className={`${style.planRow1} `}>
          <div className={style.col}>OTTs ({selectedPlan.channels.length})</div>
          <div className={style.col}>
            {/* <OttDetails
							ottList={selectedPlan.channels}
							showAll={true}
						/> */}
          </div>
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.planRow3}>
          <div className={style.Row3cols}>
            <div className={style.col}>Plan Duration</div>
            <div>{/* <b>{getPlanDuration(selectedPlan, true)}</b> */}</div>
          </div>
          {type == "renew" && (
            <>
              <div className={style.Row3cols}>
                <div>Start Date</div>
                <div>
                  <b>{formatDate(planDate, 5)}</b>
                </div>
              </div>
              <div className={style.Row3cols}>
                <div>Expiry Date</div>
                <div>
                  <b>
                    {formatDate(
                      addNoOfDays(planDate, selectedPlan.bouquet_period),
                      5,
                    )}
                  </b>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.yourPriceTable}>
          <div className={style.lablel}>Your Price</div>
          <div className={style.fairesRow}>
            <div className={style.fairesCol}>
              <div>Base</div>
              <div>
                <b>{formatPrice(selectedPlan.base_lco_price)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Tax</div>
              <div>
                <b>{formatPrice(selectedPlan.lco_tax)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Total</div>
              <div>
                <b>{formatPrice(selectedPlan.lco_price)}</b>
              </div>
            </div>
          </div>
        </div>
        <div className={style.yourPriceTable}>
          <div className={style.lablel}>Subscriber’s Price</div>
          <div className={style.fairesRow}>
            <div className={style.fairesCol}>
              <div>Base</div>
              <div>
                <b>{formatPrice(selectedPlan.base_subscriber_price)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Tax</div>
              <div>
                <b>{formatPrice(selectedPlan.subscriber_tax)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Total</div>
              <div>
                <b>{formatPrice(selectedPlan.subscriber_price)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.plantableSec}>
          {type == "renew" && (
            <ul className={style.subsPlanList}>
              <li>This Plan Starts After The Current Plan Expires</li>
              <li>Only Single Plan Can Be Queued</li>
              <li>
                Once Advanced Renewal Is Turned On, It Can't Be Turned Off
              </li>
              <li>
                On Expiry Of Currently Active Plan, This Advance Renewal Plan
                (If Processed) Will Automatically Turn ON
              </li>
            </ul>
          )}
          <div className={`${style.planRow1} ${style.startDateRow}`}>
            {type == "add" ? (
              <>
                <div className={style.col}>Start Date</div>
                <div className={style.col}>
                  <div className="datecol">
                    <CustomDatepicker
                      value={planDate}
                      // value={todaysDate}
                      callback={setPlanDate}
                      minDate={todaysDate}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={style.col}>&nbsp;</div>
                <div className={style.col}>&nbsp;</div>
              </>
            )}
            <div className={style.btnWrapper2}>
              <button
                type="button"
                className="commonBtn borderBtn"
                onClick={prevStep}
                disabled={autoRenewIsLoading}
              >
                Back
              </button>
              <button
                type="button"
                className="commonBtn dark"
                onClick={handlePlanConfirm}
                disabled={autoRenewIsLoading}
              >
                {autoRenewIsLoading ? (
                  getConstant("LOADING_TEXT")
                ) : (
                  <>
                    {type == "auto" ? (
                      "Confirm"
                    ) : (
                      <>{type == "add" ? "Activate" : "Renew"} Plan</>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
