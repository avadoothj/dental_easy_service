import style from "@/css/plan/noResult.module.scss";

export default function NoRole() {
	return (
		<div className={style.pagebg}>
			<div className={style.bg404}></div>
			<div className={style.nopagebox}>
				<div className={style.opps}>No Results Found</div>
				<div className={style.misstex}>
					No content matched your criteria. Try something else.
				</div>
			</div>
		</div>
	);
}
