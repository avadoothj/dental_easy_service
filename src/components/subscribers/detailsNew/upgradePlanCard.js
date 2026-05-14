"use client";
import style from "@/css/plan/plancard.module.scss";
// import OttDetails from "@/components/plans/ottDetails";
import { formatPrice } from "@/utils/utils";

export default function UpgradePlanCard({ item, handleUpgradePlanSelect }) {
  return (
    <div
      className={`${style.planCard} planCard `}
      onClick={() => handleUpgradePlanSelect(item)}
    >
      {item.same_plan == 1 && (
        <div className={style.currentlyPlan}>
          <div className={style.icon}>
            <div className={style.lablename}>New OTTs Added!</div>
          </div>
        </div>
      )}
      <h2>{item.bouquet_name}</h2>
      <p>
        Plan Code:<span>{item.bouquet_code}</span>
      </p>
      <hr className={style.line1} />
      {/* <h3>{getPlanDuration(item)}</h3> */}
      {/* <OttDetails ottList={item.channels} /> */}
      <hr className={style.line2} />
      <div className={style.priceWrapper}>
        <div className={style.yourPrice}>
          Your Price<span>{formatPrice(item.lco_price)}</span>
        </div>
        <div className={style.subsCriberPrice}>
          <div className={style.text}>
            Subscriber Price&nbsp;
            <span>{formatPrice(item.subscriber_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
