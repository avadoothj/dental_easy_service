import CustomImage from "@/components/common/customImage";
import style from "@/css/subscribers/subscribers.module.scss";
import { addSubscriberImage } from "@/utils/imagesPicker";

export default function NoActivePlans({ handleActiveClick }) {
	return (
		<div className={style.ActivePlan}>
			<div className={style.ActivePlanInner}>
				<div className={style.ActivePlanImg}>
					<CustomImage
						src={addSubscriberImage}
						alt="no plans"
						width="280"
						height="227"
					/>
				</div>
				<h1>You have no active plans</h1>
				<p></p>
				<div className={style.buttonWrapper}>
					<button
						id="activatePlanBtn"
						className={"commonBtn dark"}
						onClick={handleActiveClick}
					>
						Activate plan
					</button>
				</div>
			</div>
		</div>
	);
}
