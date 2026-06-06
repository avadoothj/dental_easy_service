"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomImage from "@/common/customImage";
import { sortList } from "@/utils/masterData";
import { filterIcon, sortIcon } from "@/utils/imagesPicker";
import CommonModal from "@/common/commonModal";
import { getConstant } from "@/utils/utils";
import Link from "next/link";
import commonStyle from "@/css/common/common.module.scss";

export default function SearchFilterMobile() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const defaultSelected = {
		keyword: searchParams.get("search") ?? "",

		sort: sortList[0].id,
	};

	if (searchParams.get("sort")) {
		const temp = sortList.filter((x) => x.id == searchParams.get("sort"));
		if (temp.length > 0) {
			defaultSelected.sort = temp[0].id;
		}
	}

	const [keyword, setKeyword] = useState(defaultSelected.keyword);

	const [sortBy, setSortBy] = useState(defaultSelected.sort);
	const [showSortModal, setShowSortModal] = useState(false);

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;

		if (sortBy && sortBy != sortList[0].id) temp.sort = sortBy;

		router.push(pathname + "?" + new URLSearchParams(temp).toString());

		setShowSortModal(false);
	};

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			applyFilters();
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	const handleSortToggleModal = () => {
		setShowSortModal(!showSortModal);
	};

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	return (
		<>
			<div className={style.mobsearchpanel}>
				<div className={style.colsearch1}>
					<div className={style.searchboxmob}>
						{keyword.length == 0 && (
							<button
								className={style.btnsearch}
								onClick={() => {
									jQuery("#oper_plan_search_mob").trigger("focus");
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={style.svgiconsearchmob}
									viewBox="0 0 16 16"
								>
									<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
								</svg>
							</button>
						)}
						<input
							type="text"
							id="oper_plan_search_mob"
							value={keyword}
							placeholder="Search"
							className={style.inputsearch}
							onChange={(e) => setKeyword(e.target.value)}
							maxLength={inputMaxLength}
						/>
						{keyword.length > 0 && (
							<div
								onClick={() => setKeyword("")}
								className={style.closeBtn}
							></div>
						)}
					</div>
				</div>
				<div className={style.colsearch2}>
					<button
						className={style.sortfilter}
						onClick={handleSortToggleModal}
					>
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
				</div>
				<Link
					href="/categories/add"
					className={commonStyle.commonBtn}
				>
					+ Add New
				</Link>
			</div>

			<CommonModal
				show={showSortModal}
				handleClose={handleSortToggleModal}
				className="sortmodal"
			>
				<div className="modheader">
					<span>Sort By</span>
					<span
						className="closemod"
						onClick={handleSortToggleModal}
					></span>
				</div>
				<div className="staublock nobrd">
					<ul>
						{sortList.map((x, i) => (
							<li key={i}>
								<label
									className="crwrappermob"
									onClick={() => setSortBy(x.id)}
								>
									<span>{x.label}</span>
									<input
										name="sort_by"
										type="radio"
										checked={x.id == sortBy}
										onChange={() => {}}
									/>
									<div className="crinputmob"></div>
								</label>
							</li>
						))}
					</ul>
				</div>
				<button
					type="button"
					className="buttonApply"
					onClick={() => applyFilters()}
				>
					Apply
				</button>
			</CommonModal>
		</>
	);
}
