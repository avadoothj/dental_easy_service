import { refreshIcon } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";
import SimpleTooltip from "./simpleTooltip";
import style from "@/css/common/common.module.scss";

export default function RefreshButton({ callback = () => {}, isLoading, size = 20 }) {
	const handleRefreshClick = () => {
		if (isLoading) return;
		callback();
	};

	return (
		<SimpleTooltip text="Refresh">
			<span
				className={`${style.refreshBtn} ${isLoading ? style.spin : ""}`}
				onClick={handleRefreshClick}
			>
				<CustomImage
					src={refreshIcon}
					alt="refresh"
					width={size}
					height={size}
				/>
			</span>
		</SimpleTooltip>
	);
}
