import style from "@/css/profile/profileOperator.module.scss";

export default function Highlight({ user }) {
	return (
		<div className={style.operator}>
			<div className={style.avatar}>{user.imageText}</div>
			<div className={style.profileDetail}>
				<p>{user.user_type == "internal" ? user.display_user_type : user.oper_name}</p>
				<h3>{user.login_id}</h3>
			</div>
		</div>
	);
}
