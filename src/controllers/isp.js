"use server";
import apiList from "@/utils/apiList";
import { sortList } from "@/utils/masterData";
import { callGetApi, callPostApi } from "@/utils/service";
import { getConstant } from "@/utils/utils";
import { planSortList } from "@/utils/masterData";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";

export async function getIspCounts(type = "") {
	return new Promise((resolve, reject) => {
		const payload = {
			type: type,
		};
		callPostApi(apiList.isp.getCount, payload)
			.then(function (response) {
				resolve(response.success ? response.count : 0);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspListForWalletPlans(params, type) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			type: type,
			per_page: getConstant("ISP_WALLET_PLANS_LIST_LIMIT"),
			sort: sortList[0].id,
		};

		if (params.search) payload.search = params.search;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callPostApi(apiList.isp.list, payload)
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getAllIspList(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("ISP_LIST_LIMIT"),
			sort: sortList[0].id,
		};

		if (params.search) payload.search = params.search;
		if (params.category) payload.category = params.category;
		if (params.zone) payload.zone = params.zone;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callPostApi(apiList.isp.list, payload)
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function creditDebitIspBalance(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.creditDebitBalance, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspDetails(ispId) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.isp.get + ispId)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspPlansCount(ispId) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.isp.getIspPlansCount, { ispId })
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve({ total: 0, isp_name: "" });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspPlanList(params = {}) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("PLANS_LIMIT"),
			sort: planSortList[0].id,
			isp_id: params.isp_id ?? "",
		};

		if (params.search) payload.search = params.search;
		if (params.duration) payload.duration = params.duration;
		if (params.price) payload.price = params.price;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;
		if (params.per_page) payload.per_page = params.per_page;

		callGetApi(apiList.isp.getIspPlanList, payload)
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function syncPlan(ispId) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.syncPlan, { ispId })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperatorsListForIsp(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("OPERATOR_LIMIT"),
			sort: sortList[0].id,
			isp_id: params.isp_id,
		};

		if (params.search) payload.search = params.search;
		if (params.status) payload.status = params.status;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callGetApi(apiList.isp.getOperatorList, payload)
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editIspDetails(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.edit, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/isp/details/" + formData.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editSuperIsp(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.editSuperIsp, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/isp/details/" + formData.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspTeamList(params = {}) {
	return new Promise((resolve, reject) => {
		const payload = {
			oper_id: params.operId,
			page_no: 1,
			per_page: getConstant("TEAM_LIMIT"),
		};

		if (params.search) payload.search = params.search;
		if (params.status != "all") payload.status = params.status;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callGetApi(apiList.isp.teamList, payload)
			.then(function (response) {
				if (response.success) {
					resolve(response);
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function addStackHolder(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.addStackHolder, formData)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function downloadReport() {
	return new Promise((resolve, reject) => {
		Promise.all([getServerSession(options), callGetApi(apiList.isp.downloadReport, {})])
			.then(([session, response]) => {
				if (response.success) {
					response.downloadPath = `${
						process.env.BACKEND_DOMAIN + response.filePath
					}?token=${session.user.token}`;
				}
				resolve(response);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function getIspWalletExpiryCounts() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.isp.getWalletExpiryCount)
			.then(function (response) {
				resolve(response.success ? response.count : 0);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getWalletExpiryCount() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.isp.getWalletExpiryCount)
			.then(function (response) {
				resolve(response.success ? response.count : 0);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function unassignIspPlan(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.unassignPlan, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function ispPlanInactivate(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.inactivatePlan, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function ispPlanReplace(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.replacePlan, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getAllIspPlans(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.isp.getIspPlansForSelection, payload)
			.then(function (response) {
				if (response.success) {
					const newList = response.list.map((x) => {
						return { id: x.bouquet_id, label: x.bouquet_name };
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
