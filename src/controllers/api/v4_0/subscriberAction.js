import moment from "moment-timezone";
import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { statusCodes } from "@/utils/validationErrorCodes";
import { callPostApiNoSession } from "@/utils/service";
import { convertDate } from "@/utils/dateHelper";
import { getConstant } from "@/utils/utils";
import { stringReplace } from "@/utils/utils";
import { validationSubscriberName } from "@/utils/validations/patterns";

export function subscriberAction(request, authHeader, loadTest, useQueue) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.oper_code;
		const phone = request.phone ?? "";
		const email = request.email ?? "";
		const firstName = request.first_name ?? "";
		const lastName = request.last_name ?? "";
		const planCode = request.plan_code ?? "";
		const startDate = request.start_date ?? "";
		const address = request.address ?? "";
		const txnId = request.txn_id ?? "";
		const mode = (request.mode ?? "").toUpperCase();
		const partnerRefId = request.partner_reference_id ?? null;
		const planSlot = parseInt(request.plan_slot) || 1;

		const allowedModes = [
			"CREATE",
			"CREATE_ACTIVATE",
			"ACTIVATE",
			"RENEW",
			"ASSIGN_PLAN",
			"SWITCH",
			"UPGRADE",
			"PAUSE",
			"RESUME",
			"ENABLE_AUTO_RENEW",
			"DISABLE_AUTO_RENEW",
		];

		if (txnId) {
			if (txnId.length < 10 || txnId.length > 20) {
				resolve({
					success: false,
					message: messages.INVALID_TXN_ID_LENGTH,
					code: statusCodes.validations.INVALID_TXN_ID_LENGTH,
				});
				return false;
			} else if (!/^\d+$/.test(txnId)) {
				resolve({
					success: false,
					message: messages.INVALID_TXN_ID_FORMAT,
					code: statusCodes.validations.INVALID_TXN_ID_FORMAT,
				});
				return false;
			}
		}

		if (!mode) {
			resolve({
				success: false,
				message: messages.MISSING_MODE_FIELD,
				code: statusCodes.validations.MISSING_MODE_FIELD,
			});
			return false;
		} else if (allowedModes.indexOf(mode) == -1) {
			resolve({
				success: false,
				message: messages.INVALID_MODE_VALUE,
				code: statusCodes.validations.INVALID_MODE_VALUE,
			});
			return false;
		}

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

		if (
			mode != "CREATE" &&
			mode != "ENABLE_AUTO_RENEW" &&
			mode != "DISABLE_AUTO_RENEW" &&
			!planCode
		) {
			resolve({
				success: false,
				message: messages.MISSING_PLAN_CODE_FIELD,
				code: statusCodes.validations.MISSING_PLAN_CODE_FIELD,
			});
			return false;
		}

		if (mode == "CREATE" || mode == "CREATE_ACTIVATE") {
			if (!firstName) {
				resolve({
					success: false,
					message: messages.MISSING_FIRST_NAME_FIELD,
					code: statusCodes.validations.MISSING_FIRST_NAME_FIELD,
				});
				return false;
			} else if (!lastName) {
				resolve({
					success: false,
					message: messages.MISSING_LAST_NAME_FIELD,
					code: statusCodes.validations.MISSING_LAST_NAME_FIELD,
				});
				return false;
			} else if (!validationSubscriberName().test(firstName)) {
				resolve({
					success: false,
					message: messages.INVALID_FIRST_NAME_FORMAT,
					code: statusCodes.validations.INVALID_FIRST_NAME_FORMAT,
				});
				return false;
			} else if (!validationSubscriberName().test(lastName)) {
				resolve({
					success: false,
					message: messages.INVALID_LAST_NAME_FORMAT,
					code: statusCodes.validations.INVALID_LAST_NAME_FORMAT,
				});
				return false;
			}
		}

		if (mode == "ACTIVATE" || mode == "CREATE_ACTIVATE") {
			if (startDate != "") {
				if (
					!/(\d){2}-(\d){2}-(\d){4}/g.test(startDate) ||
					!moment(startDate, "DD-MM-YYYY").isValid()
				) {
					resolve({
						success: false,
						message: messages.INVALID_START_DATE_FORMAT,
						code: statusCodes.validations.INVALID_START_DATE_FORMAT,
					});
					return false;
				}

				if (!moment(startDate, "DD-MM-YYYY").isSameOrAfter(moment(), "day")) {
					resolve({
						success: false,
						message: stringReplace(messages.START_DATE_GREATER_THAN_TODAY, {
							"{TODAY_DATE}": moment().subtract(1, "day").format("DD-MM-YYYY"),
						}),
						code: statusCodes.validations.START_DATE_GREATER_THAN_TODAY,
					});
					return false;
				}
			}
		}

		if (partnerRefId) {
			if (
				partnerRefId.length < getConstant("PARTNER_ID_MIN_LENGTH") ||
				partnerRefId.length > getConstant("PARTNER_ID_MAX_LENGTH")
			) {
				resolve({
					success: false,
					message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
						"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
						"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
					}),
					code: statusCodes.validations.INVALID_PARTNER_ID_LENGTH,
				});
				return false;
			} else if (!/^[a-zA-Z0-9]+$/i.test(partnerRefId)) {
				resolve({
					success: false,
					message: messages.INVALID_PARTNER_ID,
					code: statusCodes.validations.INVALID_PARTNER_ID,
				});
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
					resolve({
						success: false,
						message: messages.MISSING_SUBSCRIPTION_TYPE_FIELD,
						code: statusCodes.validations.MISSING_SUBSCRIPTION_TYPE_FIELD,
					});
					return false;
				} else if (!request.subscription_id) {
					resolve({
						success: false,
						message: messages.MISSING_SUBSCRIPTION_ID_FIELD,
						code: statusCodes.validations.MISSING_SUBSCRIPTION_ID_FIELD,
					});
					return false;
				} else if (!request.zone) {
					resolve({
						success: false,
						message: messages.MISSING_ZONE_FIELD,
						code: statusCodes.validations.MISSING_ZONE_FIELD,
					});
					return false;
				} else if (!request.service_number) {
					resolve({
						success: false,
						message: messages.MISSING_SERVICE_CODE_FIELD,
						code: statusCodes.validations.MISSING_SERVICE_CODE_FIELD,
					});
					return false;
				} else if (!request.state_code) {
					resolve({
						success: false,
						message: messages.MISSING_STATE_CODE_FIELD,
						code: statusCodes.validations.MISSING_STATE_CODE_FIELD,
					});
					return false;
				}
			}
		}

		const payload = {
			api_name: "subscriber_action",
			login_id: loginId,
			oper_code: operCode,
			mode: mode,
			first_name: firstName,
			last_name: lastName,
			address: address,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
			plan_code: planCode,
			start_date: "",
			partner_ref_id: partnerRefId ?? null,
			plan_slot: planSlot,
		};

		if (request.subscription_type) payload.subscription_type = request.subscription_type;
		if (request.subscription_id) payload.subscription_id = request.subscription_id;
		if (request.zone) payload.zone = request.zone;
		if (request.service_number) payload.service_code = request.service_number;
		if (request.state_code) payload.state_code = request.state_code;

		// User defined fields (Subscriber level)
		if (request.subs_udf_1) payload.subs_udf_1 = request.subs_udf_1;
		if (request.subs_udf_2) payload.subs_udf_2 = request.subs_udf_2;
		if (request.subs_udf_3) payload.subs_udf_3 = request.subs_udf_3;

		// User defined fields (Plan level)
		if (request.plan_udf_1) payload.plan_udf_1 = request.plan_udf_1;
		if (request.plan_udf_2) payload.plan_udf_2 = request.plan_udf_2;
		if (request.plan_udf_3) payload.plan_udf_3 = request.plan_udf_3;

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.use_alt_lco_code = 1;
		}

		if (startDate != "" && moment(startDate, "DD-MM-YYYY").isAfter(moment(), "day")) {
			payload.start_date = convertDate(startDate, 5);
		}

		callPostApiNoSession(
			apiList.apiV4_0.subscriberActions,
			payload,
			loadTest,
			authHeader,
			useQueue
		)
			.then(function (response) {
				if (response.sub_code) {
					response.subscriber_code = response.sub_code;
					delete response.sub_code;
				}

				if (txnId) {
					response.txn_id = txnId;
				}

				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
