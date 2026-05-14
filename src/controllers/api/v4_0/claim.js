import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function processClaimRequest(request, authData) {
	return new Promise((resolve, reject) => {
		if (request.msisdn) {
			request.msisdn = request.msisdn.slice(-10);
		}

		if (!request.msisdn) {
			resolve({
				success: false,
				msg: messages.MISSING_MSISDN_FIELD,
				code: statusCodes.validations.MISSING_MSISDN_FIELD,
			});
			return false;
		} else if (isNaN(request.msisdn) || !/^[98762](?=.*\d).{9}$/.test(request.msisdn)) {
			resolve({
				success: false,
				msg: messages.INVALID_MOBILE_FORMAT,
				code: statusCodes.validations.INVALID_MOBILE_FORMAT,
			});
			return false;
		}

		if (!request.amount) {
			resolve({
				success: false,
				msg: messages.MISSING_AMOUNT_FIELD,
				code: statusCodes.validations.MISSING_AMOUNT_FIELD,
			});
			return false;
		}

		if (!request.transaction_id) {
			resolve({
				success: false,
				msg: messages.MISSING_TRANSACTION_ID_FIELD,
				code: statusCodes.validations.MISSING_TRANSACTION_ID_FIELD,
			});
			return false;
		}

		if (!request.transaction_type) {
			resolve({
				success: false,
				msg: messages.MISSING_TRANSACTION_TYPE_FIELD,
				code: statusCodes.validations.MISSING_TRANSACTION_TYPE_FIELD,
			});
			return false;
		}

		if (!request.zone) {
			resolve({
				success: false,
				msg: messages.MISSING_ZONE_FIELD,
				code: statusCodes.validations.MISSING_ZONE_FIELD,
			});
			return false;
		}

		if (!request.circle) {
			resolve({
				success: false,
				msg: messages.MISSING_CIRCLE_FIELD,
				code: statusCodes.validations.MISSING_CIRCLE_FIELD,
			});
			return false;
		}

		if (!request.service_name) {
			resolve({
				success: false,
				msg: messages.MISSING_SERVICE_NAME_FIELD,
				code: statusCodes.validations.MISSING_SERVICE_NAME_FIELD,
			});
			return false;
		}

		if (!request.validity) {
			resolve({
				success: false,
				msg: messages.MISSING_VALIDITY_FIELD,
				code: statusCodes.validations.MISSING_VALIDITY_FIELD,
			});
			return false;
		}

		if (!request.transaction_date) {
			resolve({
				success: false,
				msg: messages.MISSING_TRANSACTION_DATE_FIELD,
				code: statusCodes.validations.MISSING_TRANSACTION_DATE_FIELD,
			});
			return false;
		}

		if (!request.claim_date) {
			resolve({
				success: false,
				msg: messages.MISSING_CLAIM_DATE_FIELD,
				code: statusCodes.validations.MISSING_CLAIM_DATE_FIELD,
			});
			return false;
		}

		const payload = {
			msisdn: request.msisdn,
			amount: request.amount,
			transaction_id: request.transaction_id,
			zone: request.zone,
			circle: request.circle,
			transaction_type: request.transaction_type,
			validity: request.validity,
			transaction_date: request.transaction_date,
			claim_date: request.claim_date,
			service_name: "",
		};

		if (typeof request.service_name == "string") {
			payload.service_name = request.service_name;
		} else if (request.service_name[0]) {
			payload.service_name = request.service_name[0];
		}

		payload.service_name = payload.service_name.replace(/[^a-z0-9]/gi, "").toLowerCase();

		callPostApiNoSession(apiList.apiV4_0.processClaim, payload, null, authData)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
