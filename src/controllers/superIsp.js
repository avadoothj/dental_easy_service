"use server";
import apiList from "@/utils/apiList";
import { sortList } from "@/utils/masterData";
import { callGetApi, callPostApi } from "@/utils/service";
import { getConstant } from "@/utils/utils";
import { planSortList } from "@/utils/masterData";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { options } from "@/nextAuth/options";

export async function getIspCounts() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.superIsp.getCount)
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

		callPostApi(apiList.superIsp.list, payload)
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

		callPostApi(apiList.superIsp.list, payload)
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

export async function getAllSuperIspList(params) {
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

		callGetApi(apiList.superIsp.getSuperIspTableList, payload)
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
		callPostApi(apiList.superIsp.creditDebitBalance, payload)
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
		callGetApi(apiList.superIsp.get + ispId)
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
		callGetApi(apiList.superIsp.getIspPlansCount, { ispId })
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

		callGetApi(apiList.superIsp.getIspPlanList, payload)
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
		callPostApi(apiList.superIsp.syncPlan, { ispId })
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getIspListForIsp(params) {
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

		callGetApi(apiList.superIsp.getIspList, payload)
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

export async function getIspListForOperator(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			super_isp_id: params.isp_id,
		};

		callGetApi(apiList.superIsp.getIspListForOper, payload)
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
		callPostApi(apiList.superIsp.edit, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/superIsp/details/" + formData.oper_id);
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

		callGetApi(apiList.superIsp.teamList, payload)
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
		callPostApi(apiList.superIsp.addStackHolder, formData)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getSuperIspList() {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(function (session) {
				if (session.user.user_type == "internal") {
					callGetApi(apiList.superIsp.getSuperIspList)
						.then(function (response) {
							if (response.success) {
								const newList = response.list.map((item) => {
									return {
										...item,
										id: item.oper_id,
										label: item.oper_name,
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
				} else {
					resolve([]);
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function addSubStackHolder(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.superIsp.addSubStackHolder, formData)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getSuperIspPlanList(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("PLANS_LIMIT"),
			sort: planSortList[0].id,
			oper_id: params.oper_id ?? "",
		};

		if (params.search) payload.search = params.search;
		if (params.duration) payload.duration = params.duration;
		if (params.price) payload.price = params.price;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;
		if (params.per_page) payload.per_page = params.per_page;

		callGetApi(apiList.superIsp.getSuperIspPlanList, payload)
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

		callGetApi(apiList.superIsp.getOperatorList, payload)
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