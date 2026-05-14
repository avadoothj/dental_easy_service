import style from "@/css/subscribers/subscribers.module.scss";
import loadingStyle from "@/css/common/loading.module.scss";

export default function PageView({ noOfItems = 9 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={style.SubscriberHistory}>
			<div className={style.main}>
				<h2 className={style.mainHeading}>Plan History</h2>
				<div className={style.tableData}>
					{data.map((v, i) => (
						<div
							className={style.tableDataCol}
							key={i}
						>
							<div className={loadingStyle.loading}>loading</div>
							<div>
								<b className={loadingStyle.loading}>loading</b>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
