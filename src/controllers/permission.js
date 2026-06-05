"use server";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";
import { getConstant } from "@/utils/utils";
import sidebarData from "@/utils/sidebarData";

export async function checkPermission(route) {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session?.user) {
				if (getConstant("SUPER_ADMIN_ROLE_ID") == session.user.role_id) {
					resolve(true);
				} else {
					resolve(session.user.allowedLinks.indexOf(route) == -1 ? false : true);
				}
			} else {
				resolve(false);
			}
		});
	});
}

export async function getUserMenuData() {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session?.user) {

				resolve(JSON.stringify(filterMenus(sidebarData, session.user.allowedLinks)));
			} else {
				resolve("");
			}
		});
	});
}

// recursively filter a single menu item + its children
const filterMenuItem = (item, allowed) => {
	const filteredChildren = (item.menus || [])
		.map((child) => filterMenuItem(child, allowed))
		.filter(Boolean);

	const selfAllowed = allowed.includes(item.link);

	if (selfAllowed || filteredChildren.length > 0) {
		return {
			...item,
			menus: filteredChildren,
		};
	}

	return null;
};

// filter the whole 2D menu array
const filterMenus = (menu2D, allowed) => {
	return menu2D
		.map((section) => section.map((item) => filterMenuItem(item, allowed)).filter(Boolean))
		.filter((section) => section.length > 0);
};
