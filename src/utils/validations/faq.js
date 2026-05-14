import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const faqValidation = {
	topic: {
		required: messages.REQUIRED_TOPIC,
		pattern: { value: validateTextPattern(), message: messages.INVALID_TEXT_FORMAT },
	},
	user_type: {
		required: messages.REQUIRED_ROLE_TYPE,
	},
	question: {
		required: messages.REQUIRED_QUESTION,
		pattern: { message: messages.INVALID_TEXT_FORMAT },
	},
	answer: {
		required: messages.REQUIRED_ANSWER,
		pattern: { message: messages.INVALID_TEXT_FORMAT },
	},
};
