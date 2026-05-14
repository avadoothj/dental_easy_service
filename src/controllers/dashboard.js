"use server";
import apiList from "@/utils/apiList";
import { callPostApi, callGetApi } from "@/utils/service";
import { dashboardPlanActivitySort, dashboardOperatorListSort } from "@/utils/masterData";

export async function getSubscriberPlanStats(fromDate, toDate) {
	return new Promise((resolve, reject) => {
		const payload = {
			from_date: fromDate,
			to_date: toDate,
		};

		callGetApi(apiList.dashboard.getSubscriberPlanStats, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getPlanRenewals(noOfDays) {
	return new Promise((resolve, reject) => {
		const payload = {
			days: noOfDays,
		};

		callPostApi(apiList.dashboard.getPlanRenewals, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getPlanRenewalsList(noOfDays) {
	return new Promise((resolve, reject) => {
		const payload = {
			days: noOfDays,
		};

		callPostApi(apiList.dashboard.getPlanRenewalsList, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getRetailerList(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getRetailerList, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getSubscriberStatus() {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getSubscriberStatus)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperatorWiseStatus(sortBy = "") {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getOperatorWiseStatus, {
			sortBy: sortBy ?? dashboardOperatorListSort[0].id,
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspWiseStatus(sortBy = "") {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getIspWiseStatus, {
			sortBy: sortBy ?? dashboardIspListSort[0].id,
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getMyPlans(showLess = true) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getMyPlans, { showLess })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getMyPlansPerformance(showLess = true, sortBy = "") {
	return new Promise((resolve, reject) => {
		const payload = {
			showLess: showLess,
			sortBy: sortBy ?? dashboardPlanActivitySort[0].id,
		};

		callGetApi(apiList.dashboard.getMyPlansPerformance, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getMyWallet() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getMyWallet)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getMyWalletActivity() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getMyWalletActivity)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getLastTopUp() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getLastTopUp)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspWalletStatus(showLess = true) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getIspWalletStatus, { showLess })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperatorWalletStatus(showLess = true) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getOperatorWalletStatus, { showLess })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperatorBalanceList(date) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.operatorBalanceList, { date: date })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getRenewalIntentCount() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getRenewalIntentCount)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getAutoRenewalIntentCount() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getAutoRenewalIntentCount)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getRenewalIntentList() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getRenewalIntentList)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspOperRenewalIntentList(showLimited = false) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getIspOperRenewalIntentList, { showLimited })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getAutoRenewalIntentList() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getAutoRenewalIntentList)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspOperAutoRenewalIntentList(showLimited = false) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.dashboard.getIspOperAutoRenewalIntentList, { showLimited })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function cancelIntent(subId) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.cancelIntent, { sub_id: subId })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function renewIntent(subId) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.renewIntent, { sub_id: subId })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function cancelAutoRenewalRequest(subId) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.cancelAutoRenewalRequest, { sub_id: subId })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getDistributorRetailerPerformance(fromDate, toDate) {
	return new Promise((resolve, reject) => {
		const payload = {
			from_date: fromDate,
			to_date: toDate,
		};

		callPostApi(apiList.dashboard.getDistributorRetailerPerformance, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getCouponStatus() {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getCouponStatus)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getCouponAllocation() {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getCouponAllocation)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getDistributorRetailerPlans(showLess = false) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getDistributorRetailerPlans, { showLess })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getDistributorRetailerPlansAllocation(showLess = false) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getDistributorRetailerPlansAllocation, { showLess })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getActivationStatus() {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.dashboard.getActivationStatus)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
