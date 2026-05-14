import axios from "axios";
import { getServerSession } from "next-auth";
import { options } from "@/nextAuth/options";
import { errorLogger } from "@/utils/utils";

export function callGetApi(action, params = {}) {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session) {
				axios({
					url: process.env.FRONTEND_DOMAIN + action,
					method: "GET",
					params: {
						token: session.user.token,
						...params,
					},
				})
					.then(function (response) {
						resolve(response.data);
					})
					.catch(function (error) {
						errorLogger("callGetApi: " + action + " " + (error.message || error));
						reject(error.message || error);
					});
			} else {
				reject("No session");
			}
		});
	});
}

export function callPostApi(action, payload) {
	return new Promise(async (resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session) {
				axios({
					url: process.env.FRONTEND_DOMAIN + action,
					method: "POST",
					data: payload,
					headers: {
						x_access_token: session.user.token,
					},
				})
					.then(function (response) {
						resolve(response.data);
					})
					.catch(function (error) {
						errorLogger("callPostApi: " + action + " " + (error.message || error));
						reject(error.message || error);
					});
			} else {
				reject("No session");
			}
		});
	});
}

export function callGetApiNoSession(action, params, loadTest = null, authHeader = null) {
	return new Promise(async (resolve, reject) => {
		const headers = {
			// x_access_token: process.env.SERVER_ACCESS_KEY,
		};

		if (loadTest && loadTest == "true") {
			headers.load_test = loadTest;
		}

		if (authHeader && authHeader != "") {
			headers.Authorization = authHeader;
		}

		axios({
			url: process.env.FRONTEND_DOMAIN + action,
			method: "GET",
			params: params,
			headers: headers,
		})
			.then(function (response) {
				resolve(response.data);
			})
			.catch(function (error) {
				errorLogger("callPostApiNoSession: " + action + " " + (error.message || error));
				reject(error.message || error);
			});
	});
}

export function callPostApiNoSession(
	action,
	payload,
	loadTest = null,
	authHeader = null,
	useQueue = null
) {
	return new Promise(async (resolve, reject) => {
		const headers = {
			x_access_token: process.env.SERVER_ACCESS_KEY,
		};

		if (loadTest && loadTest == "true") {
			headers.load_test = loadTest;
		}

		if (useQueue && useQueue == "true") {
			headers.use_queue = useQueue;
		}

		if (authHeader) {
			if (typeof authHeader == "object") {
				Object.keys(authHeader).map((key) => {
					headers[key] = authHeader[key];
					return true;
				});
			} else if (authHeader != "") {
				headers.Authorization = authHeader;
			}
		}

		axios({
			url: process.env.FRONTEND_DOMAIN + action,
			method: "POST",
			data: payload,
			headers: headers,
		})
			.then(function (response) {
				resolve(response.data);
			})
			.catch(function (error) {
				errorLogger("callPostApiNoSession: " + action + " " + (error.message || error));
				reject(error.message || error);
			});
	});
}
