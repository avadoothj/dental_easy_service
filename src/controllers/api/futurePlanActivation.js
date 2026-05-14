import moment from "moment-timezone";
import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { convertDate } from "@/utils/dateHelper";

export function futurePlanActivation(request, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.operCode;
		const apiToken = request.api_token;
		const phone = request.phone;
		const email = request.email;
		const planCode = request.plan_code;
		const startDate = request.start_date;

		if (!loginId) {
			resolve({ success: false, msg: messages.MISSING_LOGIN_ID_FIELD });
			return false;
		} else if (!apiToken) {
			resolve({ success: false, msg: messages.MISSING_API_TOKEN_FIELD });
			return false;
		} else if (!operCode) {
			resolve({ success: false, msg: messages.MISSING_OPER_CODE_FIELD });
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
		} else if (!planCode) {
			resolve({ success: false, msg: messages.MISSING_PLAN_CODE_FIELD });
			return false;
		} else if (!startDate) {
			resolve({ success: false, msg: messages.MISSING_START_DATE_FIELD });
			return false;
		} else if (
			!/(\d){2}-(\d){2}-(\d){4}/g.test(startDate) ||
			!moment(startDate, "DD-MM-YYYY").isValid()
		) {
			resolve({ success: false, msg: messages.INVALID_START_DATE_FORMAT });
			return false;
		} else if (startDate && !moment(startDate, "DD-MM-YYYY").isAfter(moment())) {
			resolve({
				success: false,
				msg: `start_date should be after ${moment().format(
					"DD-MM-YYYY"
				)} for future activation. Please use the appropriate date`,
			});
			return false;
		}

		const payload = {
			loginId: loginId,
			token: apiToken,
			operCode: operCode,
			mode: "FUTURE_ACTIVATE",
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
			planCode: planCode,
			startDate: convertDate(startDate, 5),
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		callPostApiNoSession(apiList.api.subscriberActivation, payload, loadTest)
			.then(function (response) {
				const finalResponse = { success: response.success, msg: response.msg };

				if (response.success) {
					finalResponse.ottplay_txn_id = response.ottplay_txn_id;
				}

				resolve(finalResponse);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
