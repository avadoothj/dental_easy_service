import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/team/team.module.scss";

export default function CardLoading({ noOfItems = 12 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={`${style.teammidd} forOperator`}>
			<div className={style.teamgridbox}>
				<div className={style.innergrid}>
					{data.map((v, i) => (
						<div
							className={style.inbox}
							key={i}
						>
							<div className={style.tname}>
								<div className={`${style.tnamelft} ${loadingStyle.loading}`}>
									Loading
								</div>
							</div>
							<div className={style.topname}>
								<div className={style.topnamesec}>
									<p className={`${style.tptxt} ${loadingStyle.loading}`}>
										Loading
									</p>
									<p className={`${style.btmtxt} ${loadingStyle.loading}`}>
										Loading
									</p>
								</div>
								<div className={style.topnamesec}>
									<p className={`${style.tptxt} ${loadingStyle.loading}`}>
										Loading
									</p>
									<p className={`${style.btmtxt} ${loadingStyle.loading}`}>
										Loading
									</p>
								</div>
							</div>
							<div className={style.topname}>
								<div className={style.topnamesec}>
									<p className={`${style.tptxt} ${loadingStyle.loading}`}>
										Loading
									</p>
									<p className={`${style.btmtxt} ${loadingStyle.loading}`}>
										Loading
									</p>
								</div>
								<div className={style.topnamesec}>
									<p className={`${style.tptxt} ${loadingStyle.loading}`}>
										Loading
									</p>
									<p
										className={`${style.btmtxt} ${style.avtive} ${loadingStyle.loading}`}
									>
										Loading
									</p>
								</div>
							</div>
							<div className={style.btmname}>
								<div className={style.topnamesec}>
									<p className={`${style.tptxt} ${loadingStyle.loading}`}>
										Loading
									</p>
									<p className={`${style.btmtxt} ${loadingStyle.loading}`}>
										Loading
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
