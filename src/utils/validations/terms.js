import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const termDocValidation = {
	title: {
		required: messages.REQUIRED_TERMS_TITLE,
		pattern: { value: validateTextPattern(), message: messages.INVALID_TEXT_FORMAT },
	},
	content: { required: messages.REQUIRED_TERMS_CONTENT },
};
