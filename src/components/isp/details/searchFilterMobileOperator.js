"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/common/searchPanel.module.scss";
import CustomImage from "@/common/customImage";
import { subscriberStatusList, sortList } from "@/utils/masterData";
import { filterIcon, sortIcon } from "@/utils/imagesPicker";
import CommonModal from "@/common/commonModal";
import { getConstant } from "@/utils/utils";
import Link from "next/link";

export default function SearchFilterMobileOperator({
	setKeyword,
	setStatus,
	setSortBy,
	keyword,
	sortBy,
}) {
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
			</div>
		</>
	);
}
