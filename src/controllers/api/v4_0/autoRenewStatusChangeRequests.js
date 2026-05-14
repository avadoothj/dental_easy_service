import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callGetApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function autoRenewStatusChangeRequests(request, authHeader) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.oper_code;

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		if (!operCode) {
			resolve({
				success: false,
				message: messages.MISSING_OPER_CODE_FIELD,
				code: statusCodes.validations.MISSING_OPER_CODE_FIELD,
			});
			return false;
		}

		const payload = {
			api_name: "auto_renewal_status_change_request",
			login_id: loginId,
			oper_code: operCode,
			use_alt_lco_code: 0,
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.use_alt_lco_code = 1;
		}

		callGetApiNoSession(
			apiList.apiV4_0.getAutoRenewStatusChangeRequests,
			payload,
			null,
			authHeader
		)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
