import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/common/dashboard.module.scss";

export default function ExpiringCardLoading({ noOfItems = 4 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<ul>
			{data.map((v, i) => (
				<li key={i}>
					<div className={style.contentBox}>
						<div className={`${style.col} ${loadingStyle.loading}`}>loading</div>
						<div className={style.col}>
							<b className={loadingStyle.loading}>loading</b>
						</div>
						<div className={`${style.col} ${loadingStyle.loading}`}>loading</div>
						<div className={style.col}>
							<b className={loadingStyle.loading}>loading</b>
						</div>
						<div className={`${style.col} ${loadingStyle.loading}`}>loading</div>
						<div className={style.col}>
							<b className={loadingStyle.loading}>loading</b>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
