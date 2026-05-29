"use client";
import style from "@/css/common/searchPanel.module.scss";
import CustomDropdown from "@/common/customDropdown";
import { teamStatusList, sortList } from "@/utils/masterData";

const SearchFilterTeam = ({ handleKeyword, handleStatus, handleSort, keyword }) => {
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
								className={style.inputtext}
								value={keyword}
								type="text"
								placeholder="Search Team"
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
				</div>
				<div className={`${style.colsearch2}`}>
					<div className={`${style.duration} buttdurationm forOperatorTeam1`}>
						<div className={style.drphead}>Status</div>
						<CustomDropdown
							className="buttonduration"
							id="dropdown-duration2"
							dropdownLabel="Status"
							defaultSelected={teamStatusList[0].id}
							callback={handleStatus}
							data={teamStatusList}
							showCheckbox={true}
						/>
					</div>
					<div className={`${style.pricerange} buttpricem forOperatorTeam2`}>
						<div className={style.drphead}>Sort By</div>
						<CustomDropdown
							className="buttonpricerange"
							id="dropdown-price"
							defaultSelected={sortList[0].id}
							callback={handleSort}
							data={sortList}
							showCheckbox={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchFilterTeam;
