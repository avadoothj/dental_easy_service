import Link from "next/link";
import style from "@/css/common/dashboard.module.scss";

export default function PlanExpiringCard({ item }) {
	return (
		<li>
			<div className={style.contentBox}>
				<div className={style.col}>Name</div>
				<div className={style.col}>
					<b>{item.sub_name}</b>
				</div>
				<div className={style.col}>Email ID</div>
				<div className={style.col}>
					<b>{item.email ?? "---"}</b>
				</div>
				<div className={style.col}>Contact No</div>
				<div className={style.col}>
					<b>{item.phone1 ?? "---"}</b>
				</div>
			</div>
			<Link
				href={"/subscribers/details/" + item.sub_id + "#plans"}
				target="_blank"
				className={style.btn1}
			>
				Select Plan
			</Link>
		</li>
	);
}
