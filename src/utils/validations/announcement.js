import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const addAnnouncementValidation = {
	announcement_name: {
		required: messages.ANNOUNCEMENT_NAME_REQUIRED,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	heading: {
		required: messages.ANNOUNCEMENT_CUSTOM_TEXT_REQUIRED,
	},
	color_code: {
		required: messages.ANNOUNCEMENT_COLOR_CODE_REQUIRED,
	},
	announcement_image: {
		required: messages.ANNOUNCEMENT_IMAGE_REQUIRED,
	},
};
