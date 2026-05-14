import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function getSubscriberDetails(request, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const apiToken = request.api_token;
		const phone = request.phone;
		const email = request.email;

		if (!loginId) {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		} else if (!apiToken) {
			resolve({ success: false, msg: messages.MISSING_API_TOKEN_FIELD });
			return false;
		} else if (!phone && !email) {
			resolve({ success: false, msg: messages.MISSING_MOBILE_EMAIL_FIELD });
			return false;
		} else if (
			phone != undefined &&
			phone != "" &&
			(isNaN(phone) || !/^[98762](?=.*\d).{9}$/.test(phone))
		) {
			resolve({ success: false, msg: messages.INVALID_MOBILE_FORMAT });
			return false;
		} else if (
			email != undefined &&
			email != "" &&
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
		) {
			resolve({ success: false, msg: messages.INVALID_EMAIL_FORMAT });
			return false;
		}

		const payload = {
			loginId: loginId,
			token: apiToken,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
		};

		callPostApiNoSession(apiList.api.getSubscriberDetails, payload, loadTest)
			.then(function (response) {
				if (response.success) {
					resolve({ success: true, subscriber_details: response.data });
				} else {
					resolve({ success: false, msg: response.msg });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
