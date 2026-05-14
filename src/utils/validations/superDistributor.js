import {
	validateEmailPattern,
	validateTextPattern,
	validationAlphaNum,
	validationMobilePattern,
	validationNumberOnly,
	validationExpiry,
} from "./patterns";
import messages from "@/utils/messages";

export const addSuperDistributorValidation = {
	oper_name: {
		required: messages.REQUIRED_SUPER_DISTRIBUTOR_NAME,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_SUPER_DISTRIBUTOR_NAME,
		},
	},
	isp_code: {
		required: messages.REQUIRED_SUPER_DISTRIBUTOR_CODE,
		pattern: {
			value: validationAlphaNum(),
			message: messages.INVALID_SUPER_DISTRIBUTOR_CODE,
		},
	},
	category: {
		required: messages.REQUIRED_OPERATOR_NAME,
	},
	critical_balance: {
		required: messages.REQUIRED_BALANCE_AMOUNT,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_AMOUNT },
	},
	coupon_expiry: {
		required: messages.REQUIRED_COUPON_EXPIRY,
		pattern: { value: validationExpiry(), message: messages.EXPIRY_DATE_RANGE },
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
