import React from "react";
import style from "@/css/operator/operator.module.scss";
import { addSubscriberImage, plusIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";

export default function NoBalance({ setCurrentStep, user }) {
	return (
		<div className={style.noResult}>
			<div className={style.inner}>
				<div className={style.imagebox}>
					<CustomImage
						src={addSubscriberImage}
						alt=""
					/>
				</div>
				<h1>Oops, No Balance Yet!</h1>
				{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
					<div className={style.buttonWrapper}>
						<button
							id="addBalance"
							className="commonBtn dark"
							onClick={(e) => setCurrentStep(1)}
						>
							<CustomImage
								src={plusIcon}
								alt=""
							/>
							Add Balance
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
