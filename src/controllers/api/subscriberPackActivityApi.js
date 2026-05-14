import moment from "moment-timezone";
import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { convertDate } from "@/utils/dateHelper";

export function subscriberPackActivityApi(request, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.operCode;
		const apiToken = request.api_token;
		const phone = request.phone;
		const email = request.email;
		const startDate = request.start_date ?? "";
		const txnId = request.txn_id ?? "";
		const planCode = request.plan_code ?? "";
		const mode = (request.mode ?? "").toUpperCase();

		if (txnId != "" && (txnId.length < 10 || txnId.length > 20)) {
			resolve({ success: false, msg: messages.INVALID_TXN_ID_LENGTH });
			return false;
		} else if (txnId != "" && !/^\d+$/.test(txnId)) {
			resolve({ success: false, msg: messages.INVALID_TXN_ID_FORMAT });
			return false;
		} else if (!loginId) {
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
		} else if (
			!mode ||
			(mode != "ADD" &&
				mode != "RENEW" &&
				mode != "FUTURE" &&
				mode != "PAUSE" &&
				mode != "RESUME" &&
				mode != "ENABLE_AUTO_RENEW" &&
				mode != "DISABLE_AUTO_RENEW")
		) {
			resolve({ success: false, msg: messages.INVALID_MODE_VALUE });
			return false;
		} else if (mode != "ENABLE_AUTO_RENEW" && mode != "DISABLE_AUTO_RENEW" && !planCode) {
			resolve({ success: false, msg: messages.MISSING_PLAN_CODE_FIELD });
			return false;
		} else if (
			mode == "FUTURE" &&
			(!/(\d){2}-(\d){2}-(\d){4}/g.test(startDate) ||
				!moment(startDate, "DD-MM-YYYY").isValid())
		) {
			resolve({ success: false, msg: messages.INVALID_START_DATE_FORMAT });
			return false;
		} else if (
			mode == "FUTURE" &&
			startDate &&
			!moment(startDate, "DD-MM-YYYY").isAfter(moment())
		) {
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
			mode: mode,
			planCode: planCode,
			startDate: startDate,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		if (payload.startDate != "") {
			payload.startDate = convertDate(startDate, 5);
		}

		callPostApiNoSession(apiList.api.subscriberPackActivity, payload, loadTest)
			.then(function (response) {
				const finalResponse = {
					success: response.success,
					txn_id: txnId,
					msg: response.msg,
				};

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
