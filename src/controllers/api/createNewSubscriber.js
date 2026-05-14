import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { getConstant, stringReplace } from "@/utils/utils";
import { validationSubscriberName } from "@/utils/validations/patterns";

export function createNewSubscriber(request, loadTest) {
	return new Promise((resolve, reject) => {
		const loginId = request.login_id;
		const operCode = request.operCode;
		const apiToken = request.api_token;
		const phone = request.phone;
		const email = request.email;
		const firstName = request.first_name;
		const lastName = request.last_name;
		const address = request.address ?? "";
		const partner_ref_id = request.partner_reference_id ?? null;

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
		} else if (!firstName) {
			resolve({ success: false, msg: messages.MISSING_FIRST_NAME_FIELD });
			return false;
		} else if (!lastName) {
			resolve({ success: false, msg: messages.MISSING_LAST_NAME_FIELD });
			return false;
		} else if (!validationSubscriberName().test(firstName)) {
			resolve({ success: false, msg: messages.INVALID_FIRST_NAME_FORMAT });
			return false;
		} else if (!validationSubscriberName().test(lastName)) {
			resolve({ success: false, msg: messages.INVALID_LAST_NAME_FORMAT });
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

		const payload = {
			loginId: loginId,
			token: apiToken,
			operCode: operCode,
			mode: "CREATE",
			firstName: firstName,
			lastName: lastName,
			address: address,
			phone: phone == undefined ? "" : phone.toString(),
			email: email == undefined ? "" : email.toString(),
			partner_ref_id: partner_ref_id ?? null,
		};

		if (request.use_alt_lco_code != undefined && request.use_alt_lco_code == 1) {
			payload.useAltLcoCode = 1;
		}

		callPostApiNoSession(apiList.api.createNewSubscriber, payload, loadTest)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
