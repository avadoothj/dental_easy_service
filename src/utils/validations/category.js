import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const categoryValidation = {
	category_name: {
		required: messages.REQUIRED_CATEGORY_NAME,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};
