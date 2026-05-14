import Link from "next/link";
import style from "@/css/isp/isp.module.scss";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";

export default function Card({ item }) {
	return (
		<Link href={`/isp/details/${item.oper_id}`}>
			<div className={style.inbox}>
				<div className={style.tname}>
					<div className={style.tnamelft}>
						<span>#{item.oper_code}</span>
						<SimpleTooltip text={item.oper_name}>
							<div>{item.oper_name}</div>
						</SimpleTooltip>
					</div>
				</div>
				<div className={style.topname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Category</p>
						<p className={style.btmtxt}>{item.category_name ?? "---"}</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Zone</p>
						<p className={style.btmtxt}>{item.zone_name}</p>
					</div>
				</div>
				<div className={style.topname}>
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
				</div>
			</div>
		</Link>
	);
}
