import loadingStyle from "@/css/common/loading.module.scss";

export default function ActivationLoading({ noOfItems = 8 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<>
			{data.map((item, i) => (
				<tr key={i}>
					<td>
						<span className={loadingStyle.loading}>loading</span>
					</td>
					<td>
						<span className={loadingStyle.loading}>loading</span>
					</td>
					<td>
						<span className={loadingStyle.loading}>loading</span>
					</td>
				</tr>
			))}
		</>
	);
}
