import Link from "next/link";
import style from "@/css/operator/operator.module.scss";
import { formatPrice } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";

export default function Card({ item, user }) {
	return (
		<Link href={`/operators/details/${item.oper_id}`}>
			<div className={style.operatorCard}>
				<div className={style.header}>
					<SimpleTooltip text={item.oper_name}>
						<h3>{item.oper_name}</h3>
					</SimpleTooltip>
				</div>
				{user.user_type == "internal" || user.user_type == "super isp" ? (
					<>
						<div className={style.row}>
							<div className={style.col}>
								<div className={style.label}>ISP</div>
								<div className={style.data}>
									<SimpleTooltip text={item.isp_name}>
										<span>{item.isp_name}</span>
									</SimpleTooltip>
								</div>
							</div>
							<div className={style.col}>
								<div className={style.label}>Operator Code</div>
								<div className={style.data}>{item.oper_code}</div>
							</div>
						</div>

						<div className={style.row}>
							<div className={style.col}>
								<div className={style.label}>Zone</div>
								<div className={style.data}>{item.zone_name}</div>
							</div>
							<div className={style.col}>
								<div className={style.label}>No. of Users</div>
								<div className={style.data}>{item.no_of_users}</div>
							</div>
						</div>

						<div className={style.footer}>
							Available Balance <span>{formatPrice(item.available_balance)}</span>
						</div>
					</>
				) : (
					<>
						<div className={style.row}>
							<div className={style.col}>
								<div className={style.label}>Operator Code</div>
								<div className={style.data}>{item.oper_code}</div>
							</div>
							<div className={style.col}>
								<div className={style.label}>Zone</div>
								<div className={style.data}>{item.zone_name}</div>
							</div>
						</div>
						<div className={style.row}>
							<div className={style.col}>
								<div className={style.label}>No. of Users</div>
								<div className={style.data}>{item.no_of_users}</div>
							</div>
						</div>
						<div className={style.footer}>
							Available Balance <span>{formatPrice(item.available_balance)}</span>
						</div>
					</>
				)}
			</div>
		</Link>
	);
}
