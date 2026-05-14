import { TABLE_LIST } from "@/utils/lib/tablesList";

function createFullMenu (menu) {
	const arrayUnique = (array) => {
		return array.filter(function (el, index, arr) {
			return index == arr.indexOf(el);
		});
	};

	const getChildMenus = (parentId = 0) => {
		const temp = menu
			.filter((x) => parentId == x.parent_id)
			.map((y) => {
				return {
					menu_id: y.menu_id,
					section_id: y.section_id,
					name: y.name,
					link: y.link,
					image: y.image,
					on_sidebar: y.on_sidebar,
					menus: getChildMenus(y.menu_id),
				};
			});

		return temp;
	};

	const tempMenu = getChildMenus();

	const finalMenu = [];
	arrayUnique(tempMenu.map((x) => x.section_id)).map((sectionId) => {
		finalMenu.push(tempMenu.filter((y) => sectionId == y.section_id));
	});
	return finalMenu;
};

export async function getFullMenu(){
    return new Promise((resolve, reject) => {
		let query = `select * `;
		query += `from ${TABLE_LIST.MENU_MASTER} `;
		query += `where status = 1 and link != 'actions' and parent_id not in (select menu_id from ${TABLE_LIST.MENU_MASTER} where link = 'actions') `;
		query += `order by section_id, parent_id, sort_order`;

		dbRead
			.query(query)
			.then(function (result) {
				resolve({ success: true, menu: createFullMenu(result) });
			})
			.catch(function (error) {
				reject("getMenu: " + error);
			});
	});
}