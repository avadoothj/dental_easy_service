import style from "@/css/subscribers/subscribers.module.scss";
// import { getPlanDuration } from "@/utils/utils";
import CustomImage from "@/components/common/customImage";
import { activeNow } from "@/utils/imagesPicker";

export default function PlanActivationSuccess({
  subscriber,
  selectedPlan,
  handleClose,
}) {
  return (
    <div>
      <div className={style.setsubheaderactive}>
        <span className={style.closesetsub} onClick={handleClose}></span>
      </div>
      <div className={style.nowcenter}>
        <div className={style.actnoe}>
          <CustomImage src={activeNow} alt="active" />
        </div>
        <div className={style.plantxt}>
          Plan Activated <span>Now</span>
        </div>
        <div className={style.plandtlbox}>
          <p className={style.planrowleft}>Subscriber</p>
          <p className={style.planrowright}>
            {subscriber.first_name} {subscriber.last_name}
          </p>

          <p className={style.planrowleft}>
            {subscriber.smart_card_no.includes("@") ? "Email" : "Mobile Number"}
          </p>
          <p className={style.planrowright}>{subscriber.smart_card_no}</p>

          <p className={style.planrowleft}>Plan</p>
          <p className={style.planrowright}>{selectedPlan.bouquet_name}</p>

          <p className={style.planrowleft}>Duration</p>
          <p className={style.planrowright}>
            {/* {getPlanDuration(selectedPlan, true)} */}
          </p>
        </div>
        <button className={style.savebutton} onClick={handleClose}>
          Done
        </button>
      </div>
    </div>
  );
}
