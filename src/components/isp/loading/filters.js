import Link from "next/link";
import style from "@/css/common/searchPanel.module.scss";
import CustomImage from "@/common/customImage";
import { filterIcon, sortIcon } from "@/utils/imagesPicker";
import commonStyle from "@/css/common/common.module.scss";
export default function SearchFilterLoading() {
	return (
		<>
			<div className={style.searchpanel}>
				<div className={style.colsearch1}>
					<div className={style.searchbox}>
						<div className={style.custominput}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={style.svgiconsearch}
								viewBox="0 0 16 16"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
							</svg>
							<input
								type="text"
								placeholder="Search ISP"
								className={style.inputtext}
							/>
						</div>
					</div>
				</div>
				<div className={style.colsearch2}>
					<div className={style.addteam}>
						<Link
							href="/isp/add"
							className={commonStyle.commonBtn}
						>
							+ Add New
						</Link>
					</div>
				</div>
			</div>
			<div className={style.mobsearchpanel}>
				<div className={style.colsearch1}>
					<div className={style.searchboxmob}>
						<button className={style.btnsearch}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={style.svgiconsearchmob}
								viewBox="0 0 16 16"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
							</svg>
						</button>
						<input
							placeholder="Search"
							className={style.inputsearch}
						/>
					</div>
				</div>
				<div className={style.colsearch2}>
					<button className={style.sortfilter}>
						Sort by
						<span className={style.sortfilterimg}>
							<CustomImage
								alt="sort"
								src={sortIcon}
								width="16"
								height="16"
							/>
						</span>
					</button>
					<button className={style.sortfilter}>
						Filter
						<span className={style.sortfilterimg}>
							<CustomImage
								alt="filter"
								src={filterIcon}
								width="16"
								height="16"
							/>
						</span>
					</button>
				</div>
				<Link
					href="/isp/add"
					className={commonStyle.commonBtn}
				>
					+ Add New
				</Link>
			</div>
		</>
	);
}
