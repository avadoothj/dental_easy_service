import React from "react";
import style from "@/css/roles/roles.module.scss";
import CustomImage from "@/common/customImage";
import { roleTickIcon } from "@/utils/imagesPicker";

export default function MenuListCheckbox({ item, handleCheckboxChange, checkIfAllNestedChecked }) {
	const allNestedChecked = checkIfAllNestedChecked(item.menus);

	return (
		<li key={item.menu_id}>
			<div className={style.ddname}>
				<div className={allNestedChecked ? style.selectAll : style.deselectAll}>
					<input
						type="checkbox"
						id={`checkbox-${item.menu_id}`}
						value={item.menu_id}
						checked={item.checked}
						onChange={() => handleCheckboxChange(item.menu_id)}
					/>
					<label htmlFor={`checkbox-${item.menu_id}`}>{item.name}</label>
				</div>
			</div>
			{item.menus.length > 0 && (
				<div className={style.checkboxgroup}>
					{item.menus.map((nestedItem) => (
						<React.Fragment key={nestedItem.menu_id}>
							<input
								type="checkbox"
								id={`checkbox-${nestedItem.menu_id}`}
								value={nestedItem.menu_id}
								checked={nestedItem.checked}
								onChange={() => handleCheckboxChange(nestedItem.menu_id)}
							/>
							<label htmlFor={`checkbox-${nestedItem.menu_id}`}>
								<span>
									<CustomImage
										src={roleTickIcon}
										className="web"
										width="14"
										height="10"
										alt="Close"
									/>
								</span>
								{nestedItem.name}
							</label>
						</React.Fragment>
					))}
				</div>
			)}
		</li>
	);
}
