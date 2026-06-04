const fs = require("fs");
const path = require("path");
const { dbRead, executeQuery } = require("../src/utils/lib/database");
const { TABLE_LIST } = require("../src/utils/lib/tablesList");

const filePath = path.join(__dirname, "../src/utils/sidebarData.js");

function createFullMenu(menu) {
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
}

module.exports = async () => {
	let content = "export default []";

	try {
		let query = `select * `;
		query += `from ${TABLE_LIST.MENU_MASTER} `;
		query += `where status = 1 and link != 'actions' and parent_id not in (select menu_id from ${TABLE_LIST.MENU_MASTER} where link = 'actions') `;
		query += `order by section_id, parent_id, sort_order`;

		const result = await executeQuery(query);
		if (result) {
			const menu = createFullMenu(result);
			content = "export default " + JSON.stringify(menu);
		}
	} catch (error) {
		console.log("error", error.message || error);
	}

	fs.writeFileSync(filePath, content);
};
