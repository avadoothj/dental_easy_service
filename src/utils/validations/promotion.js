import messages from "@/utils/messages";
import { validateTextPattern } from "./patterns";

export const addPromotionValidation = {
	promotion_name: {
		required: messages.PROMOTION_NAME_REQUIRED,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	custom_text: {
		required: messages.PROMOTION_CUSTOM_TEXT_REQUIRED,
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	promotion_image: {
		required: messages.PROMOTION_IMAGE_REQUIRED,
	},
};
