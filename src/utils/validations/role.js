import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const roleValidation = {
	role_name: {
		required: messages.REQUIRED_ROLE_NAME,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	role_type: {
		required: messages.REQUIRED_ROLE_TYPE,
	},
};
