"use server";
import apiList from "@/utils/apiList";
import { sortList } from "@/utils/masterData";
import { callGetApi, callPostApi } from "@/utils/service";
import { getConstant } from "@/utils/utils";
import { revalidatePath } from "next/cache";

export async function getOperatorCounts() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.operators.getOperatorCount)
			.then(function (response) {
				resolve(response.success ? response.count : 0);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getOperatorsList(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("OPERATOR_LIMIT"),
			sort: sortList[0].id,
		};

		if (params.search) payload.search = params.search;
		if (params.status) payload.status = params.status;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callGetApi(apiList.operators.list, payload)
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

export async function getOperatorDetails(operId) {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.operators.get + operId)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editOperator(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.edit, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/operators/details/" + formData.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function addNewOperator(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.add, formData)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getTeamList(params = {}) {
	return new Promise((resolve, reject) => {
		const payload = {
			oper_id: params.operId,
			page_no: 1,
			per_page: getConstant("TEAM_LIMIT"),
		};

		if (params.search) payload.search = params.search;
		if (params.status != "all") payload.status = params.status;
		// if (params.sort != "created_desc") payload.sort = params.sort;
		if (params.sort) payload.sort = params.sort;
		if (params.page_no) payload.page_no = params.page_no;

		callGetApi(apiList.operators.teamList, payload)
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

export async function addOperatorTeam(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.teamAdd, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/operators/details/" + formData.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editOperatorTeam(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.teamEdit, formData)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/operators/details/" + formData.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function editUserStatus(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.editUserStatus, payload)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/operators/details/" + payload.oper_id);
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getPlanList(params) {
	return new Promise((resolve, reject) => {
		const payload = {
			page_no: 1,
			per_page: getConstant("PLANS_LIMIT"),
			...params,
		};

		if (params.search) payload.search = params.search;

		callGetApi(apiList.operators.getPlanList, payload)
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

export async function unassignOperatorPlan(payload) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.operators.unassignPlan, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
