import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callGetApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function checkQueueRequestStatus(request, authHeader, loadTest) {
	return new Promise((resolve, reject) => {
		const requestId = request.request_id;
		const loginId = request.login_id;

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		if (!requestId) {
			resolve({
				success: false,
				message: messages.REQUEST_ID_NOT_PROVIDED,
				code: statusCodes.validations.MISSING_REQUEST_ID_FIELD,
			});
			return false;
		}

		const payload = {
			api_name: "check_queue_status",
			login_id: loginId,
			request_id: requestId,
		};

		callGetApiNoSession(apiList.apiV4_0.checkQueueRequestStatus, payload, loadTest, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
