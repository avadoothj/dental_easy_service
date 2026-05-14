"use client";
import style from "@/css/common/dashboard.module.scss";
import { useEffect, useState } from "react";
import ActivationLoading from "./loading/activationLoading";
import { getCookie } from "@/utils/utils";

export default function ActivationModal() {
	const [isLoading, setIsLoading] = useState(true);
	const [primaryCount, setPrimaryCount] = useState(0);
	const [secondaryCount, setSecondaryCount] = useState(0);
	const [tertiaryCount, setTertiaryCount] = useState(0);

	useEffect(() => {
		setIsLoading(true);
		if (getCookie("activation_status")) {
			const cookieData = getCookie("activation_status");
			const temp = JSON.parse(cookieData);
			setPrimaryCount(temp.primary);
			setSecondaryCount(temp.secondary);
			setTertiaryCount(temp.tertiary);
		}
		setIsLoading(false);
	}, []);

	return (
		<div className={style.performanceTableWrap}>
			<table>
				<thead>
					<tr>
						<th>Primary</th>
						<th>Secondary</th>
						<th>Tertiary</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<ActivationLoading />
					) : (
						<>
							<tr>
								<td>{primaryCount}</td>
								<td>{secondaryCount}</td>
								<td>{tertiaryCount}</td>
							</tr>
						</>
					)}
				</tbody>
			</table>
		</div>
	);
}
