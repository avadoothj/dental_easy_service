import messages from "@/utils/messages";
import { validatePassword, validationMobilePattern, validateEmailPattern, validateUsername } from "./patterns";
import { getConstant, stringReplace } from "@/utils/utils";

export const forcePasswordChange = {
	password: {
		required: messages.REQUIRED_PASSWORD,
		pattern: { value: validatePassword(), message: messages.PASSWORD_FORMAT },
	},
	confirm_password: { required: messages.REQUIRED_CONFIRM_PASSWORD },
};

export const changeProfilePassword = {
	current_password: { required: messages.REQUIRED_CURRENT_PASSWORD },
	new_password: {
		required: messages.REQUIRED_NEW_PASSWORD,
		pattern: { value: validatePassword(), message: messages.PASSWORD_FORMAT },
	},
	confirm_password: { required: messages.REQUIRED_CONFIRM_PASSWORD },
};

export const editProfileValidation = {
	display_name: {
		required: messages.REQUIRED_DISPLAY_NAME,
		pattern: { value: validateUsername(), message: messages.INVALID_DISPLAY_NAME },
		maxLength: {
			value: getConstant("MAXLENGTH_DISPLAY_NAME"),
			message: stringReplace(messages.MAXLENGTH_DISPLAY_NAME, {
				"{LIMIT}": getConstant("MAXLENGTH_DISPLAY_NAME"),
			}),
		},
	},
	mobile: {
		required: messages.REQUIRED_MOBILE_NO,
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
};
