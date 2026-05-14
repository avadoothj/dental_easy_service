"use client";
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AppContext } from "@/contextProvider";
import Link from "next/link";
import { formatNumber, getConstant } from "@/utils/utils";
import style from "@/css/datatables/datatable.module.scss";
import searchStyle from "@/css/common/searchPanel.module.scss";
import Loader from "./loader";
import CommonModal from "./commonModal";
import CustomDropdown from "./customDropdown";
import CustomDateRangePicker from "./dateRangePicker";
import CustomImage from "./customImage";
import { filterIcon } from "@/utils/imagesPicker";
import messages from "@/utils/messages";
import { predefinedDateRanges } from "@/utils/masterData";
import { currentDate, subtractNoOfDays } from "@/utils/dateHelper";
import { useSearchParams } from "next/navigation";

const CustomDataTable = forwardRef((props, ref) => {
	const {
		apiCall,
		setSrNo = () => {},
		setIsParentLoading = () => {},
		extraFilters = [],
		onExtraFiltersChange = () => {},
		btnLink = null,
		placeholderText = "Search",
		setData,
		isBtnLoading,
		showSelectAll = false,
		selectedItems = [],
		setSelectedItems = () => {},
		handleSelectClick = () => {},
		columns,
		children,
		columnFieldMap = {},
	} = props;

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const searchParams = useSearchParams();

	const tempFieldsFilter = {};
	extraFilters.map((x, i) => {
		if (!x.type) x.type = "select";
		if (x.type == "date" && !x.data) {
			extraFilters[i].data = predefinedDateRanges;
		}

		if (extraFilters[i].data.length > 0 && extraFilters[i].data[0].id == "all") {
			extraFilters[i].data[0].id = "";
		}

		const prefilledFromUrl = searchParams.get(x.filter);
		if (prefilledFromUrl && x.data.filter((y) => y.id == prefilledFromUrl).length > 0) {
			x.value = prefilledFromUrl;
		}

		if (!x.value) {
			if (x.type == "date") {
				const today = currentDate();
				x.value = [subtractNoOfDays(today, 89), today];
			} else {
				x.value = x.data[0].id;
			}
		}

		extraFilters[i].type = x.type;
		tempFieldsFilter[x.filter] = x.type == "date" ? x.value[0] + ":" + x.value[1] : x.value;
	});

	let perPageList = [];
	getConstant("DATATABLE_PER_PAGE")
		.split(",")
		.map((x) => {
			perPageList.push({ id: x, label: x });
		});

	const isFirstUpdate = useRef(true);
	const isFirstSearch = useRef(true);
	const isFirstPerPage = useRef(true);

	const { showAlert } = useContext(AppContext);

	const [fetchData, setFetchData] = useState(false);
	const [noRecords, setNoRecords] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(-1);
	const [pagesList, setPagesList] = useState([1]);
	const [totalPageCount, setTotalPageCount] = useState([]);
	const [filterCount, setFilterCount] = useState(-1);

	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [search, setSearch] = useState("");
	const [apiPayload, setApiPayload] = useState({});
	const [perPage, setPerPage] = useState(perPageList[0].id);
	const [perPageTemp, setPerPageTemp] = useState(perPageList[0].id);
	const [extraFieldsFilter, setExtraFieldsFilter] = useState(tempFieldsFilter);
	const [sortConfig, setSortConfig] = useState({key: "", direction: "asc",});
	const handleSort = (col) => {
		const field = columnFieldMap[col];
		if (!field) return;

		let direction = "asc";

		if (sortConfig.key === field && sortConfig.direction === "asc") {
			direction = "desc";
		}

		setSortConfig({ key: field, direction });
		setCurrentPage(0); // reload
	};
	let pageCount = perPage * currentPage;
	useImperativeHandle(ref, () => ({
		reloadData(payload = {}) {
			setFetchData(true);
			setApiPayload(payload);
			setCurrentPage(0);
		},
	}));

	useEffect(() => {
		if (isFirstUpdate.current) {
			isFirstUpdate.current = false; // Skip the first update
			return;
		}

		onExtraFiltersChange(extraFieldsFilter);
		setCurrentPage(0);
	}, [extraFieldsFilter]);

	useEffect(() => {
		onExtraFiltersChange(extraFieldsFilter);
	}, []);

	useEffect(() => {
		if (currentPage > 0) {
			handleFetchData();
			setSelectedItems([]);
			setSelectAllChecked(false);
		} else {
			setCurrentPage(1);
		}
	}, [currentPage,sortConfig]);

	useEffect(() => {
		if (isFirstPerPage.current) {
			isFirstPerPage.current = false;
			return;
		}

		setCurrentPage(0);
	}, [perPage]);

	useEffect(() => {
		processPageNo();
	}, [totalCount, filterCount]);

	useEffect(() => {
		if (isFirstSearch.current) {
			isFirstSearch.current = false;
			return;
		}

		const checkKeyword = setTimeout(() => {
			setCurrentPage(0);
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [search]);

	const handleSortToggleModal = () => {
		if (!showSortModal) {
			setPerPageTemp(perPage);
		}
		setShowSortModal(!showSortModal);
	};

	const handleMobileApplyClick = () => {
		setPerPage(perPageTemp);
		handleSortToggleModal();
	};

	const handleSelectAllClick = () => {
		handleSelectClick(selectAllChecked ? "none" : "all");
		setSelectAllChecked(!selectAllChecked);
	};

	const updateSelectedForm = (key, value) => {
		let temp = { ...extraFieldsFilter };
		temp[key] = typeof value == "object" ? value[0] + ":" + value[1] : value;
		setExtraFieldsFilter(temp);
	};

	const handleFetchData = async () => {
		if (fetchData) {
			const params = { ...apiPayload, page_no: currentPage, per_page: perPage };

			Object.keys(extraFieldsFilter).map((x) => {
				params[x] = extraFieldsFilter[x];
			});

			if (search) {
				params.search = search.trim();
			}
			if (sortConfig.key) {
			params.sort_by = sortConfig.key;
			params.sort_order = sortConfig.direction;
			}

			setIsLoading(true);
			setIsParentLoading(true);

			const response = await apiCall(params);

			setIsLoading(false);
			setIsParentLoading(false);

			if (response.success) {
				setSrNo(parseInt(currentPage - 1) * parseInt(perPage) + 1);
				setData(response.list);
				setNoRecords(response.list.length > 0 ? false : true);

				if (currentPage == 1) {
					setTotalCount(response.total ?? -1);
					setFilterCount(response.filter ?? -1);
				}

				processPageNo();
			} else {
				showAlert(response.msg);
			}
		}
	};

	const processPageNo = () => {
		if (totalCount >= 0) {
			const temp = [];
			const totalPages = Math.ceil((filterCount >= 0 ? filterCount : totalCount) / perPage);

			for (let i = currentPage - 2; i <= currentPage + 2; i++) {
				if (i > 0 && i <= totalPages) temp.push(i);
			}

			if (temp.length == 0) temp.push(1);

			setTotalPageCount(totalPages);
			setPagesList(temp);
		}
	};

	return (
		<div className={style.dataTableWrap}>
			{/* Desktop search */}
			<div className={searchStyle.searchpanel}>
				<div className={searchStyle.colsearch1}>
					<div className={searchStyle.searchbox}>
						<div className={searchStyle.custominput}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className={searchStyle.svgiconsearch}
								viewBox="0 0 16 16"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
							</svg>
							<input
								type="text"
								value={search}
								placeholder={placeholderText}
								className={searchStyle.inputtext}
								onChange={(e) => setSearch(e.target.value)}
								maxLength={inputMaxLength}
							/>
							{search.length > 0 && (
								<div
									onClick={() => setSearch("")}
									className={searchStyle.closeBtn}
								></div>
							)}
						</div>
					</div>
				</div>
				<div className={searchStyle.colsearch2}>
					{extraFilters.map((x, i) => (
						<div
							className={`${searchStyle.pricerange} buttpricem2`}
							key={i}
						>
							<div className={searchStyle.drphead}>{x.label}</div>
							{x.type == "date" ? (
								<CustomDateRangePicker
									value={x.value}
									rightAlignment={true}
									callback={(e) => updateSelectedForm(x.filter, e)}
									maxDate={x.maxDate}
								/>
							) : (
								<CustomDropdown
									className={`buttonpricerange ${x.width}`}
									id={"dropdown-" + x.filter}
									defaultSelected={x.value}
									callback={(e) => updateSelectedForm(x.filter, e)}
									data={x.data}
									showCheckbox={true}
								/>
							)}
						</div>
					))}
					<div className={`${searchStyle.pricerange} buttpricem2 showentries`}>
						<div className={searchStyle.drphead}>Show Entries</div>
						<CustomDropdown
							className="buttonpricerange"
							id="dropdown-price"
							defaultSelected={perPage}
							callback={setPerPage}
							data={perPageList}
							showCheckbox={true}
						/>
					</div>
					{btnLink !== null && (
						<div className={searchStyle.addteam}>
							{typeof btnLink.handleClick != "undefined" ? (
								<button
									className={searchStyle.addnewbtn}
									disabled={isBtnLoading}
									onClick={(e) => {
										e.preventDefault();
										btnLink.handleClick();
									}}
								>
									{isBtnLoading ? (
										getConstant("LOADING_TEXT")
									) : (
										<>
											{btnLink?.hidePlus == true ? "" : "+ "}
											{btnLink.label}
										</>
									)}
								</button>
							) : (
								<Link
									href={btnLink.link}
									className={searchStyle.addnewbtn}
								>
									{btnLink?.hidePlus == true ? "" : "+ "}
									{btnLink.label}
								</Link>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Mobile search */}
			<CommonModal
				show={showSortModal}
				handleClose={handleSortToggleModal}
				className="sortmodal"
			>
				<div className="modheader">
					<span>Filters</span>
					<span
						className="closemod"
						onClick={handleSortToggleModal}
					></span>
				</div>
				{extraFilters.map((item, index) => (
					<div
						className="staublock nobrd"
						key={index}
					>
						<div className="starow">
							<span>{item.label}</span>
						</div>
						<ul>
							{item.data.map((x, i) => (
								<li key={i}>
									<label
										className="crwrappermobsort"
										onClick={() => updateSelectedForm(item.filter, x.id)}
									>
										<span>{x.label}</span>
										<input
											name={"custom-filter-" + item.filter}
											type="radio"
											checked={x.id == extraFieldsFilter[item.filter]}
											onChange={() => {}}
										/>
										<div className="crinputmob"></div>
									</label>
								</li>
							))}
						</ul>
					</div>
				))}
				<div className="staublock nobrd">
					<div className="starow">
						<span>Show Entries</span>
					</div>
					<ul>
						{perPageList.map((x, i) => (
							<li key={i}>
								<label
									className="crwrappermob"
									onClick={() => setPerPageTemp(x.id)}
								>
									<span>{x.label}</span>
									<input
										name="sort_by"
										type="radio"
										checked={x.id == perPageTemp}
										onChange={() => {}}
									/>
									<div className="crinputmob"></div>
								</label>
							</li>
						))}
					</ul>
				</div>
				<div className="buttonApplyWrapper">
					<button
						type="button"
						className="buttonApply"
						onClick={handleMobileApplyClick}
					>
						Apply
					</button>
				</div>
			</CommonModal>

			<div className={searchStyle.mobsearchpanel}>
				<div className={searchStyle.colsearch1}>
					<div className={searchStyle.searchboxmob}>
						{search.length == 0 && (
							<button
								className={searchStyle.btnsearch}
								onClick={() => {
									jQuery("#table_search_mob").trigger("focus");
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={searchStyle.svgiconsearchmob}
									viewBox="0 0 16 16"
								>
									<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
								</svg>
							</button>
						)}
						<input
							type="text"
							id="table_search_mob"
							value={search}
							placeholder="Search"
							className={searchStyle.inputsearch}
							onChange={(e) => setSearch(e.target.value)}
							maxLength={inputMaxLength}
						/>
						{search.length > 0 && (
							<div
								onClick={() => setSearch("")}
								className={searchStyle.closeBtn}
							></div>
						)}
					</div>
				</div>
				<div className={searchStyle.colsearch2}>
					<button
						className={searchStyle.sortfilter}
						onClick={handleSortToggleModal}
					>
						Filter
						<span className={searchStyle.sortfilterimg}>
							<CustomImage
								alt="filter"
								src={filterIcon}
								width="16"
								height="16"
							/>
						</span>
					</button>
				</div>
				{btnLink !== null && (
					<>
						{typeof btnLink.handleClick != "undefined" ? (
							<button
								className={searchStyle.addnewbtn}
								disabled={isBtnLoading}
								onClick={(e) => {
									e.preventDefault();
									btnLink.handleClick();
								}}
							>
								{isBtnLoading ? (
									getConstant("LOADING_TEXT")
								) : (
									<>
										{btnLink?.hidePlus == true ? "" : "+ "}
										{btnLink.label}
									</>
								)}
							</button>
						) : (
							<Link
								href={btnLink.link}
								className={searchStyle.addnewbtn}
							>
								{btnLink?.hidePlus == true ? "" : "+ "}
								{btnLink.label}
							</Link>
						)}
					</>
				)}
			</div>

			{showSelectAll && totalCount >= 0 && (
				<div className={style.selectedResult}>
					Selected {selectedItems.length}/{totalCount}
				</div>
			)}

			{/* Table view */}
			<div className={style.dataTable}>
				{isLoading && <Loader />}

				<table>
					<thead>
						<tr>
							{showSelectAll && (
								<th>
									{totalCount >= 0 && (
										<div className={style.selectAllbox}>
											<label className={style.checkboxCol}>
												<input
													type="checkbox"
													checked={selectAllChecked}
													onChange={handleSelectAllClick}
												/>
												<span className={style.checkmark}></span>
											</label>
											{/* <div className={style.selectAllTxt}>Select All</div> */}
										</div>
									)}
								</th>
							)}
							{columns.map((col, i) => {
							const field = columnFieldMap?.[col];
							const isSortable = Object.keys(columnFieldMap).length > 0 && field;

							return (
								<th
								key={i}
								style={{ cursor: isSortable ? "pointer" : "default" }}
								onClick={() => isSortable && handleSort(col)}
								>
								{col}

								{isSortable && sortConfig.key === field && (
									<span>
									{sortConfig.direction === "asc" ? " ↑" : " ↓"}
									</span>
								)}
								</th>
							);
              				})}
						</tr>
					</thead>
					<tbody>
						{noRecords ? (
							<tr>
								<td colSpan={columns.length}>
									{isLoading ? messages.FETCHING_DATA : messages.NO_RECORDS_FOUND}
								</td>
							</tr>
						) : (
							<>{children}</>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className={style.paginationWrap}>
				{totalCount >= 0 && (
					<p>
						Showing {filterCount >= 0 && <span>{formatNumber(filterCount)} / </span>}
						{formatNumber(totalCount)} records
					</p>
				)}
				<div className={style.pagination}>
					<div className={style.arrows}>
						<button
							onClick={() => setCurrentPage(1)}
							disabled={isLoading || currentPage == 1}
						>
							{"<<"}
						</button>
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={isLoading || currentPage == 1}
						>
							{"<"}
						</button>
					</div>

					<ul>
						{pagesList.map((x) => (
							<li key={x}>
								<button
									className={currentPage == x ? style.active : ""}
									onClick={() => setCurrentPage(x)}
									disabled={isLoading || currentPage == x}
								>
									{formatNumber(x)}
								</button>
							</li>
						))}
					</ul>

					<div className={style.arrows}>
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={isLoading || currentPage == totalPageCount}
						>
							{">"}
						</button>
						<button
							onClick={() => setCurrentPage(totalPageCount)}
							disabled={isLoading || currentPage == totalPageCount}
						>
							{">>"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});

export default CustomDataTable;
