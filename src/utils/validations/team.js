import { getConstant, stringReplace } from "@/utils/utils";
import {
	validateEmailPattern,
	validationMobilePattern,
	validateUsername,
	validateLoginId,
} from "./patterns";
import messages from "@/utils/messages";

export const addTeamValidation = {
	role: {
		required: messages.REQUIRED_ROLE_TYPE,
	},
	login_id: {
		required: messages.REQUIRED_USERNAME,
		pattern: { value: validateLoginId(), message: messages.INVALID_USER_NAME },
		maxLength: {
			value: getConstant("MAXLENGTH_LOGIN_ID"),
			message: stringReplace(messages.MAXLENGTH_LOGIN_ID, {
				"{LIMIT}": getConstant("MAXLENGTH_LOGIN_ID"),
			}),
		},
	},
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
	category: {
		required: "Please select category",
	},
};
