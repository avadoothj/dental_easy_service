import style from "@/css/subscribers/subscribers.module.scss";
// import OttDetails from "@/components/plans/ottDetails";
import { formatPrice, getConstant } from "@/utils/utils";

export default function upgradePlanSelect({
  prevStep,
  upgradePlanInfo,
  autoRenewIsLoading,
  toggleUpgradePlanConfirmModal,
}) {
  return (
    <div className={style.subsPlanTable}>
      <div className={style.plantableSec}>
        <div className={`${style.planRow1} ${style.mBorder}`}>
          <div className={style.col}>Plan</div>
          <div className={style.col}>
            <b>{upgradePlanInfo.bouquet_name}</b>
          </div>
        </div>
        <div className={`${style.planRow1} `}>
          <div className={style.col}>
            OTTs ({upgradePlanInfo.channels.length})
          </div>
          <div className={style.col}>
            {/* <OttDetails
							ottList={upgradePlanInfo.channels}
							showAll={true}
						/> */}
          </div>
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.planRow3}>
          <div className={style.Row3cols}>
            <div className={style.col}>Plan Duration</div>
            <div>{/* <b>{getPlanDuration(upgradePlanInfo, true)}</b> */}</div>
          </div>
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.yourPriceTable}>
          <div className={style.lablel}>Your Price</div>
          <div className={style.fairesRow}>
            <div className={style.fairesCol}>
              <div>Base</div>
              <div>
                <b>{formatPrice(upgradePlanInfo.base_lco_price)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Tax</div>
              <div>
                <b>{formatPrice(upgradePlanInfo.lco_tax)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Total</div>
              <div>
                <b>{formatPrice(upgradePlanInfo.lco_price)}</b>
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
                <b>{formatPrice(upgradePlanInfo.base_subscriber_price)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Tax</div>
              <div>
                <b>{formatPrice(upgradePlanInfo.subscriber_tax)}</b>
              </div>
            </div>
            <div className={style.fairesCol}>
              <div>Total</div>
              <div>
                <b>{formatPrice(upgradePlanInfo.subscriber_price)}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.plantableSec}>
        <div className={style.plantableSec}>
          <div className={`${style.planRow1} ${style.startDateRow}`}>
            <>
              <div className={style.col}>&nbsp;</div>
              <div className={style.col}>&nbsp;</div>
            </>

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
                onClick={toggleUpgradePlanConfirmModal}
                disabled={autoRenewIsLoading}
              >
                {autoRenewIsLoading ? (
                  getConstant("LOADING_TEXT")
                ) : (
                  <>Upgrade Plan</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
