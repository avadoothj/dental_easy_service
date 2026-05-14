"use server";
import apiList from "@/utils/apiList";
import { callGetApi, callPostApi } from "@/utils/service";
import { getConstant } from "@/utils/utils";
import { sortList } from "@/utils/masterData";
import { revalidatePath } from "next/cache";

export async function getCategoryCounts() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.category.getCount)
			.then(function (response) {
				resolve(response.success ? response.count : 0);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getCategoryActivities() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.category.getActivities)
			.then(function (response) {
				if (response.success) {
					resolve(response.list);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getCategoryList(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("CATEGORY_LIMIT"),
			sort: sortList[0].id,
		};

		if (params.search) payload.search = params.search;
		if (params.type) payload.type = params.type;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callGetApi(apiList.category.list, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function addCategory(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.category.add, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getCategoryDetails(catId) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.category.get + catId)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editCategory(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.category.edit, payload)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/categories/edit/" + payload.cat_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
