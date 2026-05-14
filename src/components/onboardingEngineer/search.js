"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "@/css/team/team.module.scss";
import { getConstant } from "@/utils/utils";

export default function SearchBox() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [keyword, setKeyword] = useState(searchParams.get("search") || "");

	const applyFilters = () => {
		const temp = {};
		if (keyword) temp.search = keyword;
		router.push(pathname + "?" + new URLSearchParams(temp).toString());
	};

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			applyFilters();
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	return (
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
					className={style.inputtext}
					placeholder="Search Team"
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
	);
}
