import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const subscriberHistoryValidation = {
	search_term: {
		required: messages.REQUIRED_SEARCH_TERM,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};
