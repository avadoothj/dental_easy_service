import style from "@/css/common/common.module.scss";
import { addSubscriberImage } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";

export default function NoRecordsFound({ smallWidth = false }) {
	return (
		<div className={style.noResultFound}>
			<CustomImage
				alt="no data"
				src={addSubscriberImage}
				className={smallWidth ? style.smallWidth : ""}
			/>
			<h5 className={smallWidth ? style.smallWidth : ""}>No Records Found</h5>
		</div>
	);
}
