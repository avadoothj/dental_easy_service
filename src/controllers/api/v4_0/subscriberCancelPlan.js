import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function subscriberCancelPlan(request, authHeader, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.oper_code;
		const phone = request.phone ?? "";
		const email = request.email ?? "";
		const inType = request.type ?? "";
		const planSlot = parseInt(request.plan_slot) || 1;

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
			});
			return false;
		}

		if (planSlot != 1 && planSlot != 2) {
			resolve({
				success: false,
				message: messages.WRONG_PLAN_SLOT,
				code: statusCodes.validations.WRONG_PLAN_SLOT,
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

		if (inType != "" && inType.toLowerCase() != "advance") {
			resolve({
				success: false,
				message: messages.INVALID_TYPE_VALUE,
				code: statusCodes.validations.INVALID_TYPE_VALUE,
			});
			return false;
		}

		if (!phone && !email) {
			resolve({
				success: false,
				message: messages.MISSING_MOBILE_EMAIL_FIELD,
				code: statusCodes.validations.MISSING_MOBILE_EMAIL_FIELD,
			});
			return false;
		}

		if (
			phone != undefined &&
			phone != "" &&
			(isNaN(phone) || !/^[98762](?=.*\d).{9}$/.test(phone))
		) {
			resolve({
				success: false,
				message: messages.INVALID_MOBILE_FORMAT,
				code: statusCodes.validations.INVALID_MOBILE_FORMAT,
			});
			return false;
		}

		if (
			email != undefined &&
			email != "" &&
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
		) {
			resolve({
				success: false,
				message: messages.INVALID_EMAIL_FORMAT,
				code: statusCodes.validations.INVALID_EMAIL_FORMAT,
			});
			return false;
		}

		const payload = {
			api_name: "cancel_plan",
			login_id: loginId,
			oper_code: operCode,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
			type: inType,
			plan_slot: planSlot,
		};

		callPostApiNoSession(apiList.apiV4_0.cancelSubscriberPlan, payload, loadTest, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
