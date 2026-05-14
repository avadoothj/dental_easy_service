import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callGetApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function plansList(request, authHeader) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.oper_code;
		const intervalUnit = request.interval_unit;
		const interval = request.interval;
		const duration = request.duration;

		const allowedIntervalUnit = ["days", "months", "weeks", "years"];
		const allowedDurations = ["1", "3", "6", "12"];

		if (!loginId) {
			resolve({
				success: false,
				message: messages.MISSING_LOGIN_ID_FIELD,
				code: statusCodes.validations.MISSING_LOGIN_ID_FIELD,
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

		if (!intervalUnit && interval) {
			resolve({
				success: false,
				message: messages.MISSING_INTERVAL_UNIT_FIELD,
				code: statusCodes.validations.MISSING_INTERVAL_UNIT_FIELD,
			});
			return false;
		}

		if (intervalUnit && allowedIntervalUnit.indexOf(intervalUnit) == -1) {
			resolve({
				success: false,
				message: messages.INVALID_INTERVAL_UNIT_VALUE,
				code: statusCodes.validations.INVALID_INTERVAL_UNIT_VALUE,
			});
			return false;
		}

		if (duration && allowedDurations.indexOf(duration) == -1) {
			resolve({
				success: false,
				message: messages.INVALID_DURATION_VALUE,
				code: statusCodes.validations.INVALID_DURATION_VALUE,
			});
			return false;
		}

		const payload = {
			api_name: "plans_list",
			login_id: loginId,
			oper_code: operCode,
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.use_alt_lco_code = 1;
		}

		if (request.interval_unit) {
			payload.interval_unit = request.interval_unit;
		}

		if (request.interval) {
			payload.interval = request.interval;
		}

		if (request.duration) {
			payload.duration = request.duration;
		}

		callGetApiNoSession(apiList.apiV4_0.getPlanList, payload, null, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
