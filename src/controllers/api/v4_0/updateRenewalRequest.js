import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function updateRenewalRequest(request, authHeader) {
	return new Promise((resolve, reject) => {
		const login_id = request.login_id;
		const oper_code = request.oper_code;
		const use_alt_lco_code = request.use_alt_lco_code;
		const phone = request.phone ?? "";
		const email = request.email ?? "";
		const action = request.action;

		if (!login_id || login_id == "") {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		}

		if (!oper_code || oper_code == "") {
			resolve({ success: false, msg: messages.MISSING_OPER_CODE_FIELD });
			return false;
		}

		if (phone == "" && email == "") {
			resolve({ success: false, msg: messages.PHONE_NOT_PROVIDED });
			return false;
		}

		if (phone && (isNaN(phone) || !/^[98762](?=.*\d).{9}$/.test(phone))) {
			resolve({ success: false, msg: messages.INVALID_PHONE_FORMAT });
			return false;
		}

		if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			resolve({ success: false, msg: messages.INVALID_EMAIL_FORMAT });
			return false;
		}

		if (action != "DECLINE") {
			resolve({ success: false, msg: messages.INVALID_ACTION });
			return false;
		}

		const payload = {
			api_name: "update_renewal_request",
			login_id: login_id,
			oper_code: oper_code,
			use_alt_lco_code: use_alt_lco_code,
			phone: phone,
			email: email,
			action: action,
		};

		callPostApiNoSession(apiList.apiV4_0.updateRenewalRequest, payload, null, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
