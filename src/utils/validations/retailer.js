import { validateEmailPattern, validateTextPattern, validationMobilePattern } from "./patterns";
import messages from "@/utils/messages";

export const addRetailerValidation = {
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
};

export const addRetailerForIsp = {
	isp_id: { required: messages.DISTRIBUTOR_NOT_SELECTED },
};
