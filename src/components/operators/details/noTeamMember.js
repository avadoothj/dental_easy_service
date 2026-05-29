import style from "@/css/operator/operator.module.scss";
import CustomImage from "@/common/customImage";
import { addSubscriberImage, plusIcon } from "@/utils/imagesPicker";

export default function NoTeamMember({ handleAddTeamMember, user }) {
	return (
		<div className={style.noResult}>
			<div className={style.inner}>
				<div className={style.imagebox}>
					<CustomImage
						src={addSubscriberImage}
						alt="no team"
						width="336"
						height="272"
					/>
				</div>
				<h1>Oops, No Team Members Yet!</h1>
				{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
					<div className={style.buttonWrapper}>
						<button
							id="addTeamMember"
							className={`commonBtn dark`}
							onClick={handleAddTeamMember}
						>
							<CustomImage
								src={plusIcon}
								alt="add"
								width="20"
								height="20"
							/>
							Add New Team
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
