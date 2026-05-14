import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function getIspBalance(request) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const apiToken = request.api_token;

		if (!loginId) {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		} else if (!apiToken) {
			resolve({ success: false, msg: messages.MISSING_API_TOKEN_FIELD });
			return false;
		}

		const payload = {
			loginId: loginId,
			token: apiToken,
		};

		callPostApiNoSession(apiList.api.getIspBalance, payload)
			.then(function (response) {
				if (response.success) {
					resolve({ success: true, balance: response.balance });
				} else {
					resolve({ success: false, msg: response.msg });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export function getOperatorBalance(request) {
	return new Promise((resolve, reject) => {
		const operCode = request.operCode;
		const loginId = request.login_id;
		const apiToken = request.api_token;

		if (!operCode) {
			resolve({ success: false, msg: messages.MISSING_OPER_CODE_FIELD });
			return false;
		} else if (!loginId) {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		} else if (!apiToken) {
			resolve({ success: false, msg: messages.MISSING_API_TOKEN_FIELD });
			return false;
		}

		const payload = {
			operCode: operCode,
			loginId: loginId,
			token: apiToken,
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		callPostApiNoSession(apiList.api.getOperatorBalance, payload)
			.then(function (response) {
				if (response.success) {
					resolve({ success: true, balance: response.balance });
				} else {
					resolve({ success: false, msg: response.msg });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
