"use server";
import apiList from "@/utils/apiList";

import { callGetApi, callPostApi } from "@/utils/service";

export async function getStateList() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.common.getStateList, {})
			.then(function (response) {
				if (response.success) {
					const newList = response.list.map((state) => {
						return {
							...state,
							id: state.id,
							label: state.name,
						};
					});
					resolve(newList);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getDistrictList(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.common.getDistrictList, payload)
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

export async function getCityList(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.common.getCityList, payload)
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

export async function getBankList() {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.common.getBankList)
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

export async function getIspCategories() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.common.getIspCategories)
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