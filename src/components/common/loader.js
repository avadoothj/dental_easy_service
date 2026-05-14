import style from "@/css/common/common.module.scss";

export default function Loader({ theme = true }) {
	return (
		<div className={style.loaderout}>
			<div className={theme ? style.themeLoader : style.loaderdash}></div>
		</div>
	);
}
