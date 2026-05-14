import React from "react";
import { formatNumber } from "@/utils/utils";

export default function ShowFilterRecordCount({ filterCount, totalCount }) {
	return (
		<div className="resultCountpara">
			{`${formatNumber(filterCount)} results out of ${formatNumber(
				totalCount
			)} total results`}
		</div>
	);
}
