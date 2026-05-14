import axios from "axios";
import { downloadFileFromBlob, errorLogger } from "@/utils/utils";

export function callPostApiReport(backendDomain, action, token, payload, fileName) {
	return new Promise(async (resolve, reject) => {
		axios({
			url: backendDomain + action,
			method: "POST",
			data: payload,
			responseType: "blob",
			headers: { x_access_token: token },
		})
			.then(function (response) {
				if (response.data.size > 0) {
					downloadFileFromBlob(response.data, fileName);
				}
				resolve(response.data.size > 0);
			})
			.catch(function (error) {
				errorLogger("callPostApiReport: " + action + " " + (error.message || error));
				reject(error);
			});
	});
}
