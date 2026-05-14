import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callGetApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function ispBalance(request, authHeader) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		const payload = {
			api_name: "isp_balance",
			login_id: loginId,
			use_alt_lco_code: 0,
		};

		callGetApiNoSession(apiList.apiV4_0.getIspBalance, payload, null, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
