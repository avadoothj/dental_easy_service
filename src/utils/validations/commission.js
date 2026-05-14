import { validationNumberOnly } from "./patterns";
import messages from "@/utils/messages";

export const addCommissionValidation = {
	super_dist_act_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	super_dist_ren_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	dist_act_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	dist_ren_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	ret_act_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
	ret_ren_price: {
		required: messages.PRICE_REQUIRED,
		pattern: {
			value: validationNumberOnly(),
			message: messages.INVALID_AMOUNT,
		},
	},
};
