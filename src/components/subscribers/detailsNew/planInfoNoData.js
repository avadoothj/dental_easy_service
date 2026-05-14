import style from "@/css/subscribers/subscribers.module.scss";

export default function PlanInfoNoData() {
	return (
		<div className={style.subsPlanTable}>
			<div className={style.plantableSec}>
				<div className={style.planRow1}>
					<div className={style.col3}>
						<div className={style.tableData3}>
							<div className={`${style.tableDataCol3} ${style.oneColRow}`}>
								<div>Plan</div>
								<div>
									<b>--</b>
								</div>
							</div>
							<div className={style.tableDataCol3}>
								<div>Start Date</div>
								<div>
									<b>--</b>
								</div>
							</div>
							<div className={style.tableDataCol3}>
								<div>Expiry Date</div>
								<div>
									<b>--</b>
								</div>
							</div>
							<div className={style.tableDataCol3}>
								<div>Your Price</div>
								<div>
									<b>--</b>
								</div>
							</div>
							<div className={style.tableDataCol3}>
								<div>Subscriber Price</div>
								<div>
									<b>--</b>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
