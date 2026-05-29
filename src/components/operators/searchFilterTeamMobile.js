"use client";
import { useState } from "react";
import style from "@/css/common/searchPanel.module.scss";
import CommonModal from "@/common/commonModal";
import { teamStatusList, sortList } from "@/utils/masterData";
import CustomImage from "@/common/customImage";
import { filterIcon, sortIcon } from "@/utils/imagesPicker";
import { getConstant } from "@/utils/utils";

const SearchFilterTeamMobile = ({ handleKeyword, handleStatus, handleSort, keyword }) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [filter, setShowfilter] = useState(false);
	const handleClosefilter = () => setShowfilter(false);
	const handleShowfilter = () => setShowfilter(true);

	const [status, setStatus] = useState("");
	const [sortBy, setSortBy] = useState("");

	const applyFilters = () => {
		handleStatus(status);
		handleSort(sortBy);
		setShow(false);
		setShowfilter(false);
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
									jQuery("#oper_team_search_mob").trigger("focus");
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
							id="oper_team_search_mob"
							className={style.inputsearch}
							placeholder="Search"
							maxLength={inputMaxLength}
							onChange={(e) => handleKeyword(e.target.value)}
						/>
						{keyword.length > 0 && (
							<div
								onClick={() => handleKeyword("")}
								className={style.closeBtn}
							></div>
						)}
					</div>
				</div>
				<div className={style.colsearch2}>
					<button
						className={style.sortfilter}
						onClick={handleShow}
					>
						Sort by{" "}
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
						onClick={handleShowfilter}
					>
						Filter{" "}
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
			</div>

			<CommonModal
				show={filter}
				onHide={handleClosefilter}
				className="sortmodal"
			>
				<div className="modheader">
					<span>Filter</span>
					<span
						className="closemod"
						onClick={handleClosefilter}
					></span>
				</div>
				<div className="staublock">
					<div className="starow">
						<span>Status</span>
						<span>-</span>
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

				<button
					type="button"
					className="buttonApply"
					onClick={() => applyFilters()}
				>
					Apply
				</button>
			</CommonModal>

			<CommonModal
				show={show}
				onHide={handleClose}
				className="sortmodal"
			>
				<div className="modheader">
					<span>Sort By</span>
					<span
						className="closemod"
						onClick={handleClose}
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
};

export default SearchFilterTeamMobile;
