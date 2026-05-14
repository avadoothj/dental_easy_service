import CustomImage from "@/common/customImage";
import commonStyle from "@/css/common/common.module.scss";
import { closeIcon } from "@/utils/imagesPicker";

export default function BannerAlert({ handleClose, bannerImage }) {

	return (
		<div className={commonStyle.modelcbody}>
			<div
				className={commonStyle.closeicn}
				onClick={handleClose}
			>
				<CustomImage
					src={closeIcon}
					alt="close"
					width="18"
					height="18"
				/>
			</div>
			<div className={commonStyle.jioAdv}>
				{/* <CustomImage
					src={bannerImage}
					alt="jio adv"
					width="167"
					height="167"
				/> */}
				<img
					src={bannerImage}
					alt=""
					width="167"
					height="167"
				/>
			</div>
		</div>
	);
}
