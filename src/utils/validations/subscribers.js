import messages from "@/utils/messages";
import {
	validateEmailPattern,
	validateTextPattern,
	validationSubscriberName,
	validationMobilePattern,
	validationAlphaNum,
} from "./patterns";
import { getConstant, stringReplace } from "@/utils/utils";

export const addSubscriberMobileValidation = {
	first_name: {
		required: messages.REQUIRED_FIRST_NAME,
		pattern: {
			value: validationSubscriberName(),
			message: messages.INVALID_NEW_FIRST_NAME_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "First name",
			}),
		},
	},
	last_name: {
		required: messages.REQUIRED_LAST_NAME,
		pattern: {
			value: validationSubscriberName(),
			message: messages.INVALID_NEW_LAST_NAME_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "Last name",
			}),
		},
	},
	middle_name: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "Middle name",
			}),
		},
	},
	mobile: {
		required: messages.REQUIRED_MOBILE_NO,
		pattern: { value: validationMobilePattern(), message: messages.INVALID_MOBILE_FORMAT },
	},
	email: {
		pattern: { value: validateEmailPattern(), message: messages.INVALID_EMAIL_FORMAT },
		maxLength: {
			value: getConstant("MAXLENGTH_EMAIL"),
			message: stringReplace(messages.MAXLENGTH_EMAIL, {
				"{LIMIT}": getConstant("MAXLENGTH_EMAIL"),
			}),
		},
	},
	address: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	reference_id: {
		pattern: { value: validationAlphaNum(), message: messages.INVALID_PARTNER_ID },
		maxLength: {
			value: getConstant("PARTNER_ID_MAX_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
		minLength: {
			value: getConstant("PARTNER_ID_MIN_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
	},
};

export const addSubscriberEmailValidation = {
	first_name: {
		required: messages.REQUIRED_FIRST_NAME,
		pattern: {
			value: validationSubscriberName(),
			message: messages.INVALID_NEW_FIRST_NAME_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "First name",
			}),
		},
	},
	last_name: {
		required: messages.REQUIRED_LAST_NAME,
		pattern: {
			value: validationSubscriberName(),
			message: messages.INVALID_NEW_LAST_NAME_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "Last name",
			}),
		},
	},
	middle_name: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
		maxLength: {
			value: getConstant("MAXLENGTH_NAME"),
			message: stringReplace(messages.MAXLENGTH_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_NAME"),
				"{NAME}": "Middle name",
			}),
		},
	},
	mobile: {
		pattern: { value: validationMobilePattern(), message: messages.INVALID_MOBILE_FORMAT },
	},
	email: {
		required: messages.REQUIRED_EMAIL_ID,
		pattern: { value: validateEmailPattern(), message: messages.INVALID_EMAIL_FORMAT },
		maxLength: {
			value: getConstant("MAXLENGTH_EMAIL"),
			message: stringReplace(messages.MAXLENGTH_EMAIL, {
				"{LIMIT}": getConstant("MAXLENGTH_EMAIL"),
			}),
		},
	},
	address: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	reference_id: {
		pattern: { value: validationAlphaNum(), message: messages.INVALID_PARTNER_ID },
		maxLength: {
			value: getConstant("PARTNER_ID_MAX_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
		minLength: {
			value: getConstant("PARTNER_ID_MIN_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
	},
};

export const addSubscriberAdminValidation = {
	isp_id: { required: messages.ISP_NOT_SELECTED },
	operator_id: { required: messages.OPERATOR_NOT_SELECTED },
};

export const editSubscriberValidation = {
	address: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	reference_id: {
		pattern: { value: validationAlphaNum(), message: messages.INVALID_PARTNER_ID },
		maxLength: {
			value: getConstant("PARTNER_ID_MAX_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
		minLength: {
			value: getConstant("PARTNER_ID_MIN_LENGTH"),
			message: stringReplace(messages.INVALID_PARTNER_ID_LENGTH, {
				"{MIN_LIMIT}": getConstant("PARTNER_ID_MIN_LENGTH"),
				"{MAX_LIMIT}": getConstant("PARTNER_ID_MAX_LENGTH"),
			}),
		},
	},
};
