import style from "@/css/common/sidebar.module.scss";

export default function SidebarLoading({ noOfItems = 10 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={`${style.sideBarMenu} sideBarMenu`}>
			<ul>
				{data.map((v, i) => (
					<li key={i}>
						<a href="#">
							<div className={style.menuTxt}>&nbsp;</div>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
