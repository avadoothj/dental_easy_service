"use client";
import { useState } from "react";
import CommonModal from "@/common/commonModal";
import style from "@/css/common/dashboardSortPanel.module.scss";
import { sortIcon } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";

export default function SearchFilterMobile({ sortBy, setSortBy, list }) {
	const [tempSortBy, setTempSortBy] = useState(sortBy);
	const [showSortBy, setShowSortBy] = useState(false);

	const toggleSortby = () => {
		setShowSortBy(!showSortBy);
	};

	const handleApplyClick = () => {
		setSortBy(tempSortBy);
		toggleSortby();
	};

	return (
		<>
			<CommonModal
				show={showSortBy}
				onHide={toggleSortby}
				className="sortbyModal"
				backdropClassName="sortbyModalBackdrop"
			>
				<div className="sortbyModalHeader">
					<span>Sort By</span>
					<span
						className="closeBtn"
						onClick={toggleSortby}
					></span>
				</div>
				<div className="sortByModalBlock nobrd">
					<ul>
						{list.map((x, i) => (
							<li key={i}>
								<label
									className="crwrappermob"
									onClick={() => setTempSortBy(x.id)}
								>
									<span>{x.label}</span>
									<input
										name="sort_by"
										type="radio"
										checked={x.id == tempSortBy}
										onChange={() => {}}
									/>
									<div className="crinputmob"></div>
								</label>
							</li>
						))}
					</ul>
				</div>
				<button
					className="buttonApply"
					onClick={handleApplyClick}
				>
					Apply
				</button>
			</CommonModal>

			<div className={style.mobsearchpanel}>
				<div className={style.colsearch2}>
					<button
						className={style.sortfilter}
						onClick={toggleSortby}
					>
						Sort By
						<span className={style.sortfilterimg}>
							<CustomImage
								src={sortIcon}
								alt="Filter"
								width="16"
								height="16"
							/>
						</span>
					</button>
				</div>
			</div>
		</>
	);
}
