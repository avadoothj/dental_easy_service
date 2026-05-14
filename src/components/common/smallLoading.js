import { refreshIcon } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";
import style from "@/css/common/common.module.scss";

export default function SmallLoading({ size = 20 }) {
	return (
		<span className={style.smallLoading}>
			<CustomImage
				src={refreshIcon}
				alt="refresh"
				width={size}
				height={size}
			/>
		</span>
	);
}
