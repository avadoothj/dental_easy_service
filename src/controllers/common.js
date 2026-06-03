"use server";
import apiList from "@/utils/apiList";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { executeQuery } from "@/utils/lib/database";

import { callGetApi, callPostApi } from "@/utils/service";

export async function getStateList() {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await executeQuery(
				`select state_id, state_name 
				from ${TABLE_LIST.STATE_MASTER} 
				order by state_name
				`,
			);

			resolve({
				success: true,
				list: result.map((state) => ({
					id: state.state_id,
					label: state.state_name,
				})), // use result if executeQuery returns array directly
			});
			
				

		} catch (error) {
			reject({
				success: false,
				list: [],
				message: error.message,
			});
		}
	});
}

export async function getDistrictList(payload) {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await executeQuery(
				`select district_id, district_name, state_id 
				from ${TABLE_LIST.DISTRICT_MASTER} 
				where state_id = ?
				order by district_name
				`,
				[payload.state_id],
			);

			resolve({
				success: true,
				list: result.map((district) => ({
					id: district.district_id,
					name: district.district_name,
				})), // use result if executeQuery returns array directly
			});
		} catch (error) {
			reject({
				success: false,
				list: [],
				message: error.message,
			});
		}
	});
}

export async function getCityList(payload) {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await executeQuery(
				`select city_id,city_name, district_id,  state_id 
				from ${TABLE_LIST.CITY_MASTER} 
				where state_id = ? and district_id = ?
				order by city_name
				`,
				[payload.state_id, payload.district_id],
			);

			resolve({
				success: true,
				list: result.map((city) => ({
					id: city.city_id,
					name: city.city_name,
				})), // use result if executeQuery returns array directly
			});
		} catch (error) {
			reject({
				success: false,
				list: [],
				message: error.message,
			});
		}
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
