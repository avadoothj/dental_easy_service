"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomDropdown from "@/common/customDropdown";
import {
	searchLetters,
	durationList,
	priceRange,
	planSortList,
	retailerPlanSortList,
} from "@/utils/masterData";
import { getConstant } from "@/utils/utils";

export default function SearchFilter({ userType }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const defaultSelected = {
		keyword: searchParams.get("search") ?? "",
		duration: durationList[0].id,
		range: priceRange[0].id,
		sort: planSortList[0].id,
	};

	if (searchParams.get("duration")) {
		const temp = durationList.filter((x) => x.id == searchParams.get("duration"));
		if (temp.length > 0) {
			defaultSelected.duration = temp[0].id;
		}
	}

	if (searchParams.get("price")) {
		const temp = priceRange.filter((x) => x.id == searchParams.get("price"));
		if (temp.length > 0) {
			defaultSelected.range = temp[0].id;
		}
	}

	if (searchParams.get("sort")) {
		const temp = planSortList.filter((x) => x.id == searchParams.get("sort"));
		if (temp.length > 0) {
			defaultSelected.sort = temp[0].id;
		}
	}

	const [keyword, setKeyword] = useState(defaultSelected.keyword);
	const [duration, setDuration] = useState(defaultSelected.duration);
	const [range, setRange] = useState(defaultSelected.range);
	const [sortBy, setSortBy] = useState(defaultSelected.sort);

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;
		if (duration && duration != 0) temp.duration = duration;
		if (range && range != 0) temp.price = range;
		if (sortBy && sortBy != planSortList[0].id) temp.sort = sortBy;

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
	}, [range, duration, sortBy]);

	const handleKeywordClick = (letter) => {
		setKeyword(letter.toLowerCase() == "all" ? "" : letter);
	};

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
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
							placeholder="Search Plans"
							className={style.inputtext}
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
				{/* <ul className={style.searchbyletters}>
					{searchLetters.map((x, i) => (
						<li
							key={i}
							onClick={(e) => handleKeywordClick(x)}
							className={`${
								(keyword == "" && x.toUpperCase() == "ALL") ||
								keyword.toUpperCase() == x.toUpperCase()
									? style.active
									: ""
							}`}
						>
							{x}
						</li>
					))}
				</ul> */}
			</div>
			<div className={style.colsearch2}>
				<div className={`${style.duration} buttdurationm`}>
					<CustomDropdown
						className="buttonduration"
						id="dropdown-duration"
						dropdownLabel="Duration"
						data={durationList}
						defaultSelected={duration}
						showCheckbox={true}
						callback={setDuration}
					/>
				</div>
				<div className={`${style.pricerange} buttpricem`}>
					<CustomDropdown
						className="buttonpricerange"
						id="dropdown-price"
						dropdownLabel="Price Range"
						data={priceRange}
						defaultSelected={range}
						showCheckbox={true}
						callback={setRange}
					/>
				</div>
				<div className={`${style.pricerange} buttpricem`}>
					<CustomDropdown
						className="buttonpricerange"
						id="dropdown-sort"
						dropdownLabel="Sort By"
						data={userType == "retailer" ? retailerPlanSortList : planSortList}
						defaultSelected={sortBy}
						showCheckbox={true}
						callback={setSortBy}
					/>
				</div>
			</div>
		</div>
	);
}
