import { stringReplace } from "@/utils/utils";
import { validatePercentage, validateTextPattern, validationNumberOnly } from "./patterns";
import messages from "@/utils/messages";

export const addCouponValidation = {
	distributor_id: {
		required: messages.REQUIRED_DISTRIBUTOR,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	retailor_id: {
		required: messages.REQUIRED_RETAILOR,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	plan_id: { required: messages.REQUIRED_PLAN_NAME },
	discount: {
		required: messages.REQUIRED_DISCOUNT,
		pattern: {
			value: validatePercentage(),
			message: messages.INVALID_DISCOUNT,
		},
		min: {
			value: 1,
			message: stringReplace(messages.MIN_DISCOUNT_VALUE, {
				"{VALUE}": 1,
			}),
		},
		max: {
			value: 100,
			message: stringReplace(messages.MAX_DISCOUNT_VALUE, {
				"{VALUE}": 100,
			}),
		},
	},
	coupons_request: {
		required: messages.REQUIRED_COUPON_NUMBER,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_COUPON_NUMBER },
		min: {
			value: 1,
			message: stringReplace(messages.MIN_COUPON_REQUEST, {
				"{VALUE}": 1,
			}),
		},
		max: {
			value: process.env.NEXT_PUBLIC_MAX_NO_OF_COUPON_IN_REQUEST,
			message: stringReplace(messages.MAX_COUPON_REQUEST, {
				"{VALUE}": process.env.NEXT_PUBLIC_MAX_NO_OF_COUPON_IN_REQUEST,
			}),
		},
	},
	coupons_list: {
		required: messages.REQUIRED_COUPON_NUMBER,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_COUPON_NUMBER },
		min: {
			value: 1,
			message: stringReplace(messages.MIN_COUPON_REQUEST, {
				"{VALUE}": 1,
			}),
		},
		max: {
			value: process.env.NEXT_PUBLIC_MAX_NO_OF_COUPON_FOR_ASSIGN,
			message: stringReplace(messages.MAX_COUPON_REQUEST, {
				"{VALUE}": process.env.NEXT_PUBLIC_MAX_NO_OF_COUPON_FOR_ASSIGN,
			}),
		},
	},
	remark: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};
