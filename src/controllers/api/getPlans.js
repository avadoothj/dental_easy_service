import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function getOperatorPlans(request) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.operCode;
		const apiToken = request.api_token;
		const duration = request.duration;

		if (!loginId) {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		} else if (!apiToken) {
			resolve({ success: false, msg: messages.MISSING_API_TOKEN_FIELD });
			return false;
		} else if (!operCode) {
			resolve({ success: false, msg: messages.MISSING_OPER_CODE_FIELD });
			return false;
		} else if (duration && duration != 1 && duration != 3 && duration != 6 && duration != 12) {
			resolve({ success: false, msg: messages.MISSING_OPER_CODE_FIELD });
			return false;
		}

		const payload = {
			loginId: loginId,
			token: apiToken,
			operCode: operCode,
			duration: duration ?? 0,
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		callPostApiNoSession(apiList.api.getOperatorPlansList, payload)
			.then(function (response) {
				if (response.success) {
					resolve({ success: true, activeplans: response.list });
				} else {
					resolve({ success: false, msg: response.msg });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
