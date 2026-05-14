import style from "@/css/plan/noResult.module.scss";

export default function NoRecords({ isAllowBulk = true }) {
	return (
		<div className={style.pagebg}>
			<div className={style.bg404}></div>
			<div className={style.nopagebox}>
				<div className={style.opps}>No Subscribers Found</div>
				<div className={style.misstex}>Try something else</div>
			</div>
		</div>
	);
}
