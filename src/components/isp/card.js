import Link from "next/link";
import style from "@/css/isp/isp.module.scss";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";

export default function Card({ item }) {
	return (
		<Link href={`/isp/details/${item.entity_id}`}>
			<div className={style.inbox}>
				<div className={style.tname}>
					<div className={style.tnamelft}>
						<span>#{item.entity_id}</span>
						<SimpleTooltip text={item.entity_name}>
							<div>{item.entity_name}</div>
						</SimpleTooltip>
					</div>
				</div>
				<div className={style.topname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>contact_no</p>
						<p className={style.btmtxt}>{item.contact_no ?? "---"}</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Email</p>
						<p className={style.btmtxt}>{item.oper_email_1 ?? "---"}</p>
					</div>
				</div>
				{/* <div className={style.topname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>No. of Users</p>
						<p className={style.btmtxt}>{item.no_of_users}</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>No. of Operators</p>
						<p className={style.btmtxt}>{item.no_of_operator}</p>
					</div>
				</div>
				<div className={style.btmname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>
							Wallet Balance <span>{formatPrice(item.balance)}</span>
						</p>
					</div>
				</div> */}
			</div>
		</Link>
	);
}
