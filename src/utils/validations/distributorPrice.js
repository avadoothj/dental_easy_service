import { validationNumberOnly, validationNumberOnlyWithDecimal } from "./patterns";
import messages from "@/utils/messages";

export const addDistributorPriceValidation = {
	distributor_price: {
		required: messages.REQUIRED_DISTRIBUTOR_PRICE,
		pattern: { value: validationNumberOnlyWithDecimal(), message: messages.INVALID_AMOUNT },
	},
	discount_value: {
		required: messages.REQUIRED_DISTRIBUTOR_DISCOUNT,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_DISCOUNT_VALUE },
	},
};
