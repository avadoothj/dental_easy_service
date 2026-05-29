import style from "@/css/operator/operator.module.scss";
import CustomImage from "@/common/customImage";
import { addSubscriberImage, plusIcon } from "@/utils/imagesPicker";

export default function NoPlan({ handleAssignPlan, user }) {
	return (
		<>
			<div className={style.noResult}>
				<div className={style.inner}>
					<div className={style.imagebox}>
						<CustomImage
							src={addSubscriberImage}
							alt="no plan"
							width="336"
							height="272"
						/>
					</div>
					<h1>Oops, No Plans Yet!</h1>

					{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
						<div className={style.buttonWrapper}>
							<button
								id="assignPlan"
								className={`commonBtn dark`}
								onClick={handleAssignPlan}
							>
								<CustomImage
									src={plusIcon}
									alt=""
								/>
								Assign Plan
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
