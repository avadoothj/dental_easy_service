import style from "@/css/plan/ottDetails.module.scss";
import CustomImage from "@/common/customImage";
import { getConstant } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";

export default function ottDetails({ ottList, showAll = false }) {
	const limit = getConstant("OTT_LIST_LIMIT");
	const otts = showAll ? ottList : ottList.slice(0, limit);

	return (
		<ul className={style.providerLogos}>
			{otts.map((x, i) => (
				<li key={i}>
					<SimpleTooltip text={x.channel_name}>
						<a
							href="#"
							onClick={(e) => e.preventDefault()}
							tabIndex="-1"
						>
							<CustomImage
								src={x.image}
								alt={x.channel_name}
								width="55"
								height="55"
							/>
						</a>
					</SimpleTooltip>
				</li>
			))}
			{ottList.length > limit && !showAll && (
				<li className={style.viewMore}>+{ottList.length - limit + " OTTS"}</li>
			)}
		</ul>
	);
}
