import style from "@/css/plan/noResult.module.scss";

export default function NoRecords({ noPadding = false }) {
	return (
		<div className={`${style.pagebg} ${noPadding ? style.removePadding : ""}`}>
			<div className={style.bg404}></div>
			<div className={style.nopagebox}>
				<div className={style.opps}>No Records Found</div>
				<div className={style.misstex}>Try something else</div>
			</div>
		</div>
	);
}
