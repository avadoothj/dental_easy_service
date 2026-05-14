import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";
import { statusCodes } from "@/utils/validationErrorCodes";

export function updateRedeemStatus(request, authHeader) {
	return new Promise((resolve, reject) => {
		const mobile = request.mobile ?? "";
		const email = request.email ?? "";
		const user = request.user;
		const coupon = request.coupon;

		if (!user || user == "") {
			resolve({
				success: false,
				msg: messages.USER_NOT_PROVIDED,
				code: statusCodes.validations.MISSING_USER_FIELD,
			});
			return false;
		}

		if (mobile == "" && email == "") {
			resolve({
				success: false,
				msg: messages.MISSING_MOBILE_EMAIL_FIELD,
				code: statusCodes.validations.MISSING_MOBILE_EMAIL_FIELD,
			});
			return false;
		}

		if (mobile && (isNaN(mobile) || !/^[98762](?=.*\d).{9}$/.test(mobile))) {
			resolve({
				success: false,
				msg: messages.INVALID_MOBILE_FORMAT,
				code: statusCodes.validations.INVALID_MOBILE_FORMAT,
			});
			return false;
		}

		if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
			resolve({
				success: false,
				msg: messages.INVALID_EMAIL_FORMAT,
				code: statusCodes.validations.INVALID_EMAIL_FORMAT,
			});
			return false;
		}

		if (!coupon || coupon == "") {
			resolve({
				success: false,
				msg: messages.MISSING_COUPON_FIELD,
				code: statusCodes.validations.MISSING_COUPON_FIELD,
			});
			return false;
		}

		const payload = {
			mobile: mobile,
			email: email,
			user: user,
			coupon: coupon,
		};

		callPostApiNoSession(apiList.apiV4_0.updateCouponRedeemStatus, payload, null, authHeader)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
