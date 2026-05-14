import { validationNumberOnlyWithDecimal } from "./patterns";
import messages from "@/utils/messages";

export const setPlanPrice = {
	distributor: {
		required: messages.DISTRIBUTOR_NOT_SELECTED,
	},
	operator: {
		required: messages.REQUIRED_OPERATOR,
	},
	plan_price: {
		required: messages.REQUIRED_PLAN_PRICE,
		pattern: { value: validationNumberOnlyWithDecimal(), message: messages.INVALID_PRICE },
	},
};
