"use server";
import apiList from "@/utils/apiList";
import { callPostApi, callGetApi } from "@/utils/service";

export async function getSubscribersCount(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboardNew.getSubscriberCount, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function refreshSubscribersCount() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboardNew.refreshSubscribersCount)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function refreshMyPerformanceCount() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboardNew.refreshMyPerformanceCount)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getActivationRenewalsData(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboardNew.getActivationRenewalsData, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getTopPlanPerformanceData(payload) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboardNew.getTopPlanPerformanceData, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperRenewIntentCount(payload) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboardNew.getRenewIntentCountNew, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
