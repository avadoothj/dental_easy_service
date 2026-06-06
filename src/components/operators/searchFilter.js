"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomDropdown from "@/common/customDropdown";
import { searchLetters, subscriberStatusList, sortList } from "@/utils/masterData";
import commonStyle from "@/css/common/common.module.scss";

export default function SearchFilter({ user }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const defaultSelected = {
		keyword: searchParams.get("search") ?? "",
		status: subscriberStatusList[0].id,
		sort: sortList[0].id,
	};

	if (searchParams.get("status")) {
		const temp = subscriberStatusList.filter((x) => x.id == searchParams.get("status"));
		if (temp.length > 0) {
			defaultSelected.status = temp[0].id;
		}
	}

	if (searchParams.get("sort")) {
		const temp = sortList.filter((x) => x.id == searchParams.get("sort"));
		if (temp.length > 0) {
			defaultSelected.sort = temp[0].id;
		}
	}

	const [keyword, setKeyword] = useState(defaultSelected.keyword);
	const [status, setStatus] = useState(defaultSelected.status);
	const [sortBy, setSortBy] = useState(defaultSelected.sort);

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;
		if (status && status != "all") temp.status = status;
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
	}, [status, sortBy]);

	const handleKeywordClick = (letter) => {
		setKeyword(letter.toLowerCase() == "all" ? "" : letter);
	};

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
							placeholder="Search Operators"
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
				{/* <div className={`${style.duration} buttdurationm`}>
					<CustomDropdown
						className="buttonduration"
						id="dropdown-duration"
						dropdownLabel="Status"
						data={subscriberStatusList}
						defaultSelected={status}
						showCheckbox={true}
						callback={setStatus}
					/>
				</div> */}
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
				{user?.allowedLinks.indexOf("/stakeholderAddEdit") >= 0 && (
					<div className={style.addteam}>
						<Link
							href="/operators/add"
							className={commonStyle.commonBtn}
						>
							+ Add New
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
