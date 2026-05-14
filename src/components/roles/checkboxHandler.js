import { useState } from "react";

export function useCheckboxHandler(initialMenuItems) {
	const [menuItems, setMenuItems] = useState(initialMenuItems);

	const handleCheckboxChange = (menu_id) => {
		setMenuItems((prevMenuItems) => {
			const updatedMenuItems = prevMenuItems.map((item) => {
				if (item.menu_id === menu_id) {
					// Toggle the checked status of the clicked item
					return {
						...item,
						checked: !item.checked,
						menus: item.menus.map((nestedItem) => ({
							...nestedItem,
							checked: !item.checked,
						})),
					};
				} else if (item.menus.some((nestedItem) => nestedItem.menu_id === menu_id)) {
					// If the clicked item is a child menu, update its checked status
					const newMenus = item.menus.map((nestedItem) =>
						nestedItem.menu_id === menu_id
							? {
									...nestedItem,
									checked: !nestedItem.checked,
							  }
							: nestedItem
					);
					const isAnyNestedChecked = newMenus.some((nestedItem) => nestedItem.checked);
					return {
						...item,
						checked: isAnyNestedChecked,
						menus: newMenus,
					};
				} else {
					return item;
				}
			});

			return updatedMenuItems;
		});
	};

	const checkIfAllNestedChecked = (nestedItems) => {
		return nestedItems.every((nestedItem) => nestedItem.checked);
	};

	return { menuItems, handleCheckboxChange, checkIfAllNestedChecked };
}
