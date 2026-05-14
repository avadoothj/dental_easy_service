"use server";
import apiList from "@/utils/apiList";
import { callGetApi } from "@/utils/service";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";

export async function getOperatorListByIsp() {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session.user.user_type == "isp") {
				callGetApi(apiList.partners.getOperatorListByIsp, {})
					.then(function (response) {
						resolve(response);
					})
					.catch(function (error) {
						reject(error);
					});
			} else {
				resolve({ success: false });
			}
		});
	});
}

export async function getOperatorByCatId(catId) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.partners.getOperatorByCatId, { cat_id: catId })
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

export async function getIspList() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.partners.getIspList)
			.then(function (response) {
				if (response.success) {
					const newList = response.list.map((op) => {
						return {
							id: op.oper_id,
							label: op.oper_name,
							activation_type: op.activation_type,
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

export async function getCouponDistributorList() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.partners.getCouponDistributorList)
			.then(function (response) {
				if (response.success) {
					const newList = response.list.map((op) => {
						return {
							id: op.oper_id,
							label: op.oper_name,
							activation_type: op.activation_type,
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
