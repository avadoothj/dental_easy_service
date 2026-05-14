"use server";

import {
	getLinkList,
	getPendingList,
	getTodayVisitedList,
	editPendingSite,
	list,
	todayVisitedList,
	deleteLink,
	updateSingleLink,
} from "@/controllers/api/web-page-watcher/addLink";

export async function getWebPageWatcherList(params = {}) {
	if (params.list_type === "today" || params.status === "today") {
		// return getTodayVisitedList(params);
		return todayVisitedList(params);
	}
	// return getLinkList(params);
	return list(params);
}

export async function editPendingSiteAction(payload) {
	return editPendingSite(payload);
}


export async function deleteSiteVisitData(id) {
	return await deleteLink(id);
}

export async function updateSiteVisitData(id, payload) {
	return await updateSingleLink(id, payload);
}
