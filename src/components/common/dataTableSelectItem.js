import style from "@/css/datatables/datatable.module.scss";

export default function DataTableSelectItem({ item, selectedItems, handleSelectClick }) {
	return (
		<div className={style.selectAllTd}>
			<label className={style.checkboxCol}>
				<input
					type="checkbox"
					checked={selectedItems.indexOf(item.item_id) >= 0 ? true : false}
					onChange={() => {
						handleSelectClick(item.item_id);
					}}
				/>
				<span className={style.checkmark}></span>
			</label>
		</div>
	);
}
