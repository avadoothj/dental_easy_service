import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callGetApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function subscriberDetails(request, authHeader, loadTest) {
	return new Promise((resolve, reject) => {
		const phone = request.phone ?? "";
		const email = request.email ?? "";
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

		if (!phone && !email) {
			resolve({
				success: false,
				message: messages.PHONE_NOT_PROVIDED,
				code: statusCodes.validations.MISSING_MOBILE_EMAIL_FIELD,
			});
			return false;
		}

		if (phone && (isNaN(phone) || !/^[98762](?=.*\d).{9}$/.test(phone))) {
			resolve({
				success: false,
				message: messages.INVALID_MOBILE_FORMAT,
				code: statusCodes.validations.INVALID_MOBILE_FORMAT,
			});
			return false;
		}

		if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			resolve({
				success: false,
				message: messages.INVALID_EMAIL_FORMAT,
				code: statusCodes.validations.INVALID_EMAIL_FORMAT,
			});
			return false;
		}

		const payload = {
			api_name: "subscriber_details",
			login_id: loginId,
			oper_code: operCode,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
		};

		callGetApiNoSession(apiList.apiV4_0.getSubscriberDetails, payload, loadTest, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
