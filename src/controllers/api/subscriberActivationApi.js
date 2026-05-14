import moment from "moment-timezone";
import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { convertDate } from "@/utils/dateHelper";
import { getConstant, stringReplace } from "@/utils/utils";
import { validationSubscriberName } from "@/utils/validations/patterns";

export function subscriberActivationApi(request, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.operCode;
		const apiToken = request.api_token;
		const phone = request.phone;
		const email = request.email;
		const firstName = request.first_name ?? "";
		const lastName = request.last_name ?? "";
		const planCode = request.plan_code ?? "";
		const startDate = request.start_date ?? "";
		const address = request.address ?? "";
		const mode = (request.mode ?? "").toUpperCase();
		const partner_ref_id = request.partner_reference_id ?? null;

		if (!mode) {
			resolve({ success: false, msg: messages.MISSING_MODE_FIELD });
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
			(mode == "CREATE" || mode == "CREATE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
			!firstName
		) {
			resolve({ success: false, msg: messages.MISSING_FIRST_NAME_FIELD });
			return false;
		} else if (
			(mode == "CREATE" || mode == "CREATE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
			!lastName
		) {
			resolve({ success: false, msg: messages.MISSING_LAST_NAME_FIELD });
			return false;
		} else if (
			(mode == "CREATE" || mode == "CREATE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
			!validationSubscriberName().test(firstName)
		) {
			resolve({ success: false, msg: messages.INVALID_FIRST_NAME_FORMAT });
			return false;
		} else if (
			(mode == "CREATE" || mode == "CREATE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
			!validationSubscriberName().test(lastName)
		) {
			resolve({ success: false, msg: messages.INVALID_LAST_NAME_FORMAT });
			return false;
		} else if (mode != "CREATE" && !planCode) {
			resolve({ success: false, msg: messages.MISSING_PLAN_CODE_FIELD });
			return false;
		} else if (
			mode != "CREATE" &&
			mode != "ACTIVATE" &&
			mode != "FUTURE_ACTIVATE" &&
			mode != "CREATE_ACTIVATE" &&
			mode != "CREATE_FUTURE_ACTIVATION" &&
			mode != "RENEW" &&
			mode != "ASSIGN_PLAN" &&
			mode != "SWITCH"
		) {
			resolve({ success: false, msg: messages.INVALID_MODE_VALUE });
			return false;
		} else if (
			(mode == "FUTURE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
			(!/(\d){2}-(\d){2}-(\d){4}/g.test(startDate) ||
				!moment(startDate, "DD-MM-YYYY").isValid())
		) {
			resolve({ success: false, msg: messages.INVALID_START_DATE_FORMAT });
			return false;
		} else if (
			(mode == "FUTURE_ACTIVATE" || mode == "CREATE_FUTURE_ACTIVATION") &&
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
		} else if (partner_ref_id) {
			if (
				partner_ref_id.length < getConstant("PARTNER_ID_MIN_LENGTH") ||
				partner_ref_id.length > getConstant("PARTNER_ID_MAX_LENGTH")
			) {
				resolve({
					success: false,
					msg: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
						"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
						"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
					}),
				});
				return false;
			} else if (!/^[a-zA-Z0-9]+$/i.test(partner_ref_id)) {
				resolve({ success: false, msg: messages.INVALID_PARTNER_ID });
				return false;
			}
		}

		if (
			process.env.SUBSCRIBER_EXTRA_FIELDS_MANDATORY_FOR != undefined &&
			process.env.SUBSCRIBER_EXTRA_FIELDS_MANDATORY_FOR != ""
		) {
			if (
				process.env.SUBSCRIBER_EXTRA_FIELDS_MANDATORY_FOR.split(",").indexOf(loginId) != -1
			) {
				if (!request.subscription_type) {
					resolve({ success: false, msg: messages.MISSING_SUBSCRIPTION_TYPE_FIELD });
					return false;
				} else if (!request.subscription_id) {
					resolve({ success: false, msg: messages.MISSING_SUBSCRIPTION_ID_FIELD });
					return false;
				} else if (!request.zone) {
					resolve({ success: false, msg: messages.MISSING_ZONE_FIELD });
					return false;
				} else if (!request.service_number) {
					resolve({ success: false, msg: messages.MISSING_SERVICE_CODE_FIELD });
					return false;
				} else if (!request.state_code) {
					resolve({ success: false, msg: messages.MISSING_STATE_CODE_FIELD });
					return false;
				}
			}
		}

		const payload = {
			loginId: loginId,
			token: apiToken,
			operCode: operCode,
			mode: mode,
			firstName: firstName,
			lastName: lastName,
			address: address,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
			planCode: planCode,
			startDate: startDate,
			partner_ref_id: partner_ref_id ?? null,
		};

		if (request.subscription_type) payload.subscription_type = request.subscription_type;
		if (request.subscription_id) payload.subscription_id = request.subscription_id;
		if (request.zone) payload.zone = request.zone;
		if (request.service_number) payload.service_code = request.service_number;
		if (request.state_code) payload.state_code = request.state_code;

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		if (payload.startDate != "") {
			payload.startDate = convertDate(startDate, 5);
		}

		callPostApiNoSession(apiList.api.subscriberActivation, payload, loadTest)
			.then(function (response) {
				const finalResponse = {
					success: response.success,
					msg: response.msg,
					sub_code: response.sub_code,
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
