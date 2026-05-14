import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/category/category.module.scss";
import { getConstant } from "@/utils/utils";
import Link from "next/link";

export default function CardLoading({ noOfItems = getConstant("CATEGORY_LIMIT") }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<div className={style.catManagementWrap}>
			<ul className={style.cardList}>
				{data.map((v, i) => (
					<li key={i}>
						<Link href="#">
							<span className={`${loadingStyle.loading}`}>Loading</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
