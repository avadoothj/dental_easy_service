import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function subscriberDetails(request, authHeader, loadTest) {
	return new Promise((resolve, reject) => {
		const user = request.user ?? "";
		const loginId = request.login_id ?? "";
		const identifier = request.identifier ?? "";

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		if (!user || user == "") {
			resolve({
				success: false,
				msg: messages.USER_NOT_PROVIDED,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		if (identifier == "") {
			resolve({
				success: false,
				msg: messages.PHONE_NOT_PROVIDED,
				code: statusCodes.validations.MISSING_MOBILE_EMAIL_FIELD,
			});
			return false;
		}

		if (identifier.includes("@")) {
			if (identifier && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(identifier)) {
				resolve({
					success: false,
					msg: messages.INVALID_EMAIL_FORMAT,
					code: statusCodes.validations.INVALID_EMAIL_FORMAT,
				});
				return false;
			}
		} else {
			if (identifier && (isNaN(identifier) || !/^[98762](?=.*\d).{9}$/.test(identifier))) {
				resolve({
					success: false,
					msg: messages.INVALID_PHONE_FORMAT,
					code: statusCodes.validations.INVALID_MOBILE_FORMAT,
				});
				return false;
			}
		}

		const payload = {
			identifier: identifier,
			login_id: loginId,
			user: user,
		};

		callPostApiNoSession(apiList.internal.getSubscriberDetails, payload, loadTest, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
