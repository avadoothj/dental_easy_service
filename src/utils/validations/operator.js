import {
	validateEmailPattern,
	validateTextPattern,
	validationMobilePattern,
	validationNumberOnly,
} from "./patterns";
import messages from "@/utils/messages";

export const addOperatorValidation = {
	oper_name: {
		required: messages.REQUIRED_OPERATOR_NAME,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},

	email: {
		required: messages.REQUIRED_EMAIL_ID,
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},

	address: {
		required: messages.REQUIRED_OPERATOR_ADDRESS,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},

	mobile: {
		required: messages.REQUIRED_MOBILE_NO,
		pattern: { value: validationMobilePattern(), message: messages.INVALID_MOBILE_FORMAT },
	},

	auto_renewal_hold_days: {
		required: messages.REQUIRED_AUTO_RENEWAL_HOLD_DAYS,
		pattern: { value: validationNumberOnly(), message: messages.NUMBER_ONLY },
	},
};

export const addOperatorForIsp = {
	isp_id: { required: messages.ISP_NOT_SELECTED },
};
