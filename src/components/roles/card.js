import style from "@/css/roles/roles.module.scss";
import commonStyle from "@/css/common/common.module.scss";
import Link from "next/link";
import { roleTypesList } from "@/utils/masterData";

export default function Card({ item }) {
	let roleType = "---";

	roleTypesList
		.filter((x) => x.id == item.cat_id)
		.map((x) => {
			roleType = x.label;
		});

	return (
		<Link href={`/roles/edit/${item.role_id}`}>
			<div className={style.roleCard}>
				<div className={style.rname}>{item.name}</div>

				<div className={style.rtype}>
					<div>Role Type</div>
					<div className={style.rolename}>{roleType}</div>
				</div>
				<div className={commonStyle.rarw}></div>
			</div>
		</Link>
	);
}
