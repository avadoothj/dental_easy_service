import loadingStyle from "@/css/common/loading.module.scss";

export default function ViewOperatorStatusLoading({ noOfItems = 8, noOfColumns = 3 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);
	let cols = [];
	for (let i = 0; i < noOfColumns; i++) cols.push(i);
	return (
		<>
			{data.map((item, i) => (
				<tr key={i}>
					{cols.map((col, j) => (
						<td key={i + j}>
							<span className={loadingStyle.loading}>loading</span>
						</td>
					))}
				</tr>
			))}
		</>
	);
}
