import loadingStyle from "@/css/common/loading.module.scss";
import operatorStyle from "@/css/operator/operator.module.scss";
import style from "@/css/plan/plancard.module.scss";
import CustomImage from "@/common/customImage";
import { getConstant } from "@/utils/utils";
import ottStyle from "@/css/plan/ottDetails.module.scss";

export default function PlanViewLoading({
	noOfItems = 1,
	noOfOtt = getConstant("OTT_LIST_LIMIT"),
}) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	let ott = [];
	for (let i = 0; i < noOfOtt; i++) ott.push(i);

	return (
		<div className={`${operatorStyle.planCardWrapper} operatorPlanCard`}>
			{data.map((v, i) => (
				<div
					key={i}
					className={style.planCard}
				>
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
						<div className={style.yourPrice}>
							<span className={loadingStyle.loading}>Loading</span>
						</div>
						<div className={style.subsCriberPrice}>
							<div className={style.text}>
								<span className={loadingStyle.loading}>Loading</span>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
