import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/roles/roles.module.scss";
import commonStyle from "@/css/common/common.module.scss";
import { getConstant } from "@/utils/utils";

export default function CardLoading({ noOfItems = getConstant("ROLE_LIMIT") }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={style.rolewrapper}>
			{data.map((v, i) => (
				<div
					key={i}
					className={style.roleCard}
				>
					<div className={`${style.rname} ${loadingStyle.loading}`}>Loading</div>
					<div className={`${style.rtype} ${loadingStyle.loading}`}>
						<div>Loading</div>
						<div className={`${style.rolename} ${loadingStyle.loading}`}>Loading</div>
					</div>
					<div className={commonStyle.rarw}></div>
				</div>
			))}
		</div>
	);
}
