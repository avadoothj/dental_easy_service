"use client";
import style from "@/css/common/dashboard.module.scss";
import CustomDropdown from "@/common/customDropdown";

export default function SearchFilter({ sortBy, setSortBy, list }) {
	return (
		<div className={`${style.durationWrap} durationDropdown`}>
			<div className={style.desktopFilter}>
				<div className={style.durationHeader}>Sort By</div>
				<CustomDropdown
					className="durationBtn"
					id="dropdown-duration2"
					dropdownLabel=""
					data={list}
					defaultSelected={sortBy}
					showCheckbox={true}
					callback={setSortBy}
				/>
			</div>
		</div>
	);
}
