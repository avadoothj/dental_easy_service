import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const addFacingIssueValidation = {
	title: {
		required: messages.FACING_ISSUE_TITLE_REQUIRED,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	description: {
		required: messages.FACING_ISSUE_DESC_REQUIRED,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	link: {
		required: messages.FACING_ISSUE_URL_REQUIRED,
	},
};
