import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/resetPassword/resetPassword.module.scss";
import { getConstant } from "@/utils/utils";

export default function CardLoading({ noOfItems = getConstant("RESET_PASSWORD_LIMIT") }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={style.resetPassWord}>
			{data.map((v, i) => (
				<div
					className={style.passWordCard}
					key={i}
				>
					<div className={style.header}>
						<h3 className={loadingStyle.loading}>loading</h3>
						<div className="threedotpop"></div>
					</div>
					<div className={style.row}>
						<div className={style.col}>
							<div className={`${style.label} ${loadingStyle.loading}`}>loading</div>
							<div className={`${style.data} ${loadingStyle.loading}`}>loading</div>
						</div>
						<div className={style.col}>
							<div className={`${style.label} ${loadingStyle.loading}`}>loading</div>
							<div className={`${style.data} ${loadingStyle.loading}`}>loading</div>
						</div>
					</div>
					<div className={style.row}>
						<div className={style.col}>
							<div className={`${style.label} ${loadingStyle.loading}`}>loading</div>
							<div className={`${style.data} ${loadingStyle.loading}`}>loading</div>
						</div>
						<div className={style.col}>
							<div className={`${style.label} ${loadingStyle.loading}`}>loading</div>
							<div className={`${style.data} ${loadingStyle.loading}`}>loading</div>
						</div>
					</div>
					<div className={style.footer}>
						<a
							href="#"
							className={`${style.btn2} ${loadingStyle.loading}`}
						>
							loading
						</a>
						<a
							href="#"
							className={`${style.btn2} ${loadingStyle.loading}`}
						>
							loading
						</a>
					</div>
				</div>
			))}
		</div>
	);
}
