"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomDropdown from "@/common/customDropdown";
import { AppContext } from "@/contextProvider";
import { searchLetters, teamStatusList, sortList, roleTypesList } from "@/utils/masterData";

export default function SearchFilter() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { user } = useContext(AppContext);

	const roleTypes = [{ id: "all", label: "All" }, ...roleTypesList.filter((x) => x.id != 2)];

	const defaultSelected = {
		keyword: searchParams.get("search") ?? "",
		status: teamStatusList[0].id,
		role: roleTypes[0].id,
		sort: sortList[0].id,
	};

	if (searchParams.get("status")) {
		const temp = teamStatusList.filter((x) => x.id == searchParams.get("status"));
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
	const [role, setRole] = useState(defaultSelected.role);
	const [sortBy, setSortBy] = useState(defaultSelected.sort);

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;
		if (status && status != "all") temp.status = status;
		if (sortBy && sortBy != sortList[0].id) temp.sort = sortBy;
		if (role && role != "all") temp.role = role;
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
	}, [status, sortBy, role]);

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
							placeholder="Search User"
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
				<div className={`${style.duration} buttdurationm`}>
					<CustomDropdown
						className="buttonduration"
						id="dropdown-duration"
						dropdownLabel="Status"
						data={teamStatusList}
						defaultSelected={status}
						showCheckbox={true}
						callback={setStatus}
					/>
				</div>
				{/* <div className={`${style.duration} buttdurationm`}>
					<CustomDropdown
						className="buttonduration"
						id="dropdown-duration"
						dropdownLabel="User type"
						data={roleTypes}
						defaultSelected={role}
						showCheckbox={true}
						callback={setRole}
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
				{user?.allowedLinks.indexOf("/createUpdateInternalUser") >= 0 && (
					<div className={style.addteam}>
						<Link
							href="/team/add"
							className={style.addnewbtn}
						>
							+ Add New
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
