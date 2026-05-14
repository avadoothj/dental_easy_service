import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function updateCmsPlanStatus(request, authHeader) {
	return new Promise((resolve, reject) => {
		const mobile = request.mobile ?? "";
		const email = request.email ?? "";
		const user = request.user;
		const planCode = request.plan_code;

		if (!user || user == "") {
			resolve({ success: false, msg: messages.USER_NOT_PROVIDED });
			return false;
		}

		if (mobile == "" && email == "") {
			resolve({ success: false, msg: messages.PHONE_NOT_PROVIDED });
			return false;
		}

		if (mobile && (isNaN(mobile) || !/^[98762](?=.*\d).{9}$/.test(mobile))) {
			resolve({ success: false, msg: messages.INVALID_PHONE_FORMAT });
			return false;
		}

		if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			resolve({ success: false, msg: messages.INVALID_EMAIL_FORMAT });
			return false;
		}

		if (!planCode || planCode == "") {
			resolve({ success: false, msg: messages.MISSING_PLAN_CODE_FIELD });
			return false;
		}

		const payload = {
			mobile: mobile,
			email: email,
			user: user,
			plan_code: planCode,
			start_date: request.start_date ?? "",
			end_date: request.end_date ?? "",
			transaction_id: request.referenceId ?? "",
		};

		callPostApiNoSession(apiList.apiV4_0.updateCmsPlanStatus, payload, null, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
