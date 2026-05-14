"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomImage from "@/common/customImage";
import { teamStatusList, sortList, roleTypesList } from "@/utils/masterData";
import { filterIcon, sortIcon } from "@/utils/imagesPicker";
import CommonModal from "@/common/commonModal";
import { AppContext } from "@/contextProvider";
import { getConstant } from "@/utils/utils";

export default function SearchFilterMobile() {
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
	const [sortBy, setSortBy] = useState(defaultSelected.sort);
	const [showSortModal, setShowSortModal] = useState(false);
	const [role, setRole] = useState(defaultSelected.role);
	const [showFilterModal, setShowFilterModal] = useState(false);

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;
		if (status && status != "all") temp.status = status;
		if (sortBy && sortBy != sortList[0].id) temp.sort = sortBy;
		if (status && status != "all") temp.status = status;
		if (role && role != "all") temp.role = role;

		router.push(pathname + "?" + new URLSearchParams(temp).toString());

		setShowSortModal(false);
		setShowFilterModal(false);
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

	const handleFilterToggleModal = () => {
		setShowFilterModal(!showFilterModal);
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
									jQuery("#team_search_mob").trigger("focus");
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
							value={keyword}
							id="team_search_mob"
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
					<button
						className={style.sortfilter}
						onClick={handleFilterToggleModal}
					>
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
				{user?.allowedLinks.indexOf("/createUpdateInternalUser") >= 0 && (
					<Link
						href="/team/add"
						className={style.addnewbtn}
					>
						+ Add New
					</Link>
				)}
			</div>
			<CommonModal
				show={showFilterModal}
				handleClose={handleFilterToggleModal}
				className="sortmodal"
			>
				<div className="modheader">
					<span>Filter</span>
					<span
						className="closemod"
						onClick={handleFilterToggleModal}
					></span>
				</div>
				<div className="staublock">
					<div className="starow">
						<span>Status</span>
					</div>
					<ul>
						{teamStatusList.map((x, i) => (
							<li key={i}>
								<label
									className="crwrappermobsort"
									onClick={() => setStatus(x.id)}
								>
									<span>{x.label}</span>
									<input
										name="mob_duration"
										type="radio"
										checked={x.id == status}
										onChange={() => {}}
									/>
									<div className="crinputmob"></div>
								</label>
							</li>
						))}
					</ul>
				</div>
				{/* <div className="staublock nobrd">
					<div className="starow">
						<span>User type</span>
					</div>
					<ul>
						{roleTypes.map((x, i) => (
							<li key={i}>
								<label
									className="crwrappermobsort"
									onClick={() => setRole(x.id)}
								>
									<span>{x.label}</span>
									<input
										name="mob_price"
										type="radio"
										checked={x.id == role}
										onChange={() => {}}
									/>
									<div className="crinputmob"></div>
								</label>
							</li>
						))}
					</ul>
				</div> */}
				<button
					type="button"
					className="buttonApply"
					onClick={() => applyFilters()}
				>
					Apply
				</button>
			</CommonModal>
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
					<div className="starow">
						<span>Status</span>
					</div>
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
