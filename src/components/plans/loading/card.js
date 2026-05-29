import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/plan/plancard.module.scss";
import ottStyle from "@/css/plan/ottDetails.module.scss";
import CustomImage from "@/common/customImage";
import { getConstant } from "@/utils/utils";

export default function CardLoading({
	parentClassName,
	noOfItems = getConstant("PLANS_LIMIT"),
	noOfOtt = 5,
}) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	let ott = [];
	for (let i = 0; i < noOfOtt; i++) ott.push(i);

	return (
		<div className={parentClassName}>
			{data.map((v, i) => (
				<div
					key={i}
					className={style.planCard}
				>
					<div className="threedotpop"></div>
					<h2 className={loadingStyle.loading}>Loading</h2>
					<p className={loadingStyle.loading}>Loading</p>
					<hr className={style.line1} />
					<h3 className={loadingStyle.loading}>Loading</h3>
					<ul className={ottStyle.providerLogos}>
						{ott.map((x, i) => (
							<li key={i}>
								<a
									href="#"
									tabIndex="-1"
									onClick={(e) => e.preventDefault()}
								>
									<CustomImage
										width="55"
										height="55"
									/>
								</a>
							</li>
						))}
					</ul>
					<hr className={style.line2} />
					<div className={style.priceWrapper}>
						<div className={`${style.yourPrice} ${loadingStyle.loading}`}>Loading</div>
					</div>
				</div>
			))}
		</div>
	);
}
