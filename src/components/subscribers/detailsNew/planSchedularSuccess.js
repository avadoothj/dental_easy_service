import style from "@/css/subscribers/subscribers.module.scss";
import { formatDate } from "@/utils/utils";
import { schedularIcon } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";

export default function PlanSchedularSuccess({
  subscriber,
  selectedPlan,
  handleClose,
  startDate,
}) {
  return (
    <div>
      <div className={style.setsubheaderactive}>
        <span className={style.closesetsub} onClick={handleClose}></span>
      </div>
      <div className={style.nowcenter}>
        <div className={style.actnoe}>
          <CustomImage src={schedularIcon} alt="scheduled" />
        </div>
        <div className={style.plantxt}>Plan Scheduled for Activation</div>
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

          <p className={style.planrowleft}>Start</p>
          <p className={`${style.planrowright} ${style.green}`}>
            {formatDate(startDate, 5)}
          </p>
        </div>
        <button className={style.savebutton} onClick={handleClose}>
          Done
        </button>
      </div>
    </div>
  );
}
