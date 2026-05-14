import {
	validateEmailPattern,
	validateTextPattern,
	validationAlphaNum,
	validationMobilePattern,
	validationNumberOnly,
	validationExpiry,
} from "./patterns";
import messages from "@/utils/messages";

export const addIspValidation = {
	oper_name: {
		required: messages.REQUIRED_ISP_NAME,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_ISP_NAME,
		},
	},
	isp_code: {
		required: messages.REQUIRED_ISP_CODE,
		pattern: {
			value: validationAlphaNum(),
			message: messages.INVALID_ISP_CODE,
		},
	},
	category: {
		required: messages.ISP_CAT_NOT_SELECTED,
	},
	critical_balance: {
		required: messages.REQUIRED_BALANCE_AMOUNT,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_AMOUNT },
	},
	contact1: {
		required: messages.REQUIRED_MOBILE_NO,
		pattern: { value: validationMobilePattern(), message: messages.INVALID_MOBILE_FORMAT },
	},
	email1: {
		required: messages.REQUIRED_EMAIL_ID,
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},
	email2: {
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
	coupon_expiry: {
		required: messages.REQUIRED_COUPON_EXPIRY,
		pattern: { value: validationExpiry(), message: messages.EXPIRY_DATE_RANGE },
	},
	finance_email1: {
		required: messages.REQUIRED_EMAIL_ID,
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},
	finance_email2: {
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},
	business_email1: {
		required: messages.REQUIRED_EMAIL_ID,
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},
	business_email2: {
		pattern: {
			value: validateEmailPattern(),
			message: messages.INVALID_EMAIL_FORMAT,
		},
	},
	sap_code: {
		pattern: {
			value: validationAlphaNum(),
			message: messages.INVALID_SAP_CODE,
		},
	},
};
