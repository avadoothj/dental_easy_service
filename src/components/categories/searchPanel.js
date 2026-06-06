"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomDropdown from "@/common/customDropdown";
import { sortList } from "@/utils/masterData";
import commonStyle from "@/css/common/common.module.scss";

export default function SearchFilter() {
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

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;

		if (sortBy && sortBy != sortList[0].id) temp.sort = sortBy;

		router.push(pathname + "?" + new URLSearchParams(temp).toString());
	};

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			applyFilters();
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	useEffect(() => {
		applyFilters();
	}, [sortBy]);

	return (
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
							value={keyword}
							placeholder="Search Category"
							className={style.inputtext}
							onChange={(e) => setKeyword(e.target.value)}
						/>
						{keyword.length > 0 && (
							<div
								onClick={() => setKeyword("")}
								className={style.closeBtn}
							></div>
						)}
					</div>
				</div>
			</div>
			<div className={style.colsearch2}>
				<div className={`${style.pricerange} buttpricem`}>
					<CustomDropdown
						className="buttonpricerange"
						id="dropdown-price"
						dropdownLabel="Sort By"
						data={sortList}
						defaultSelected={sortBy}
						showCheckbox={true}
						callback={setSortBy}
					/>
				</div>
				<div className={style.addteam}>
					<Link
						href="/categories/add"
						className={commonStyle.commonBtn}
					>
						+ Add New
					</Link>
				</div>
			</div>
		</div>
	);
}
